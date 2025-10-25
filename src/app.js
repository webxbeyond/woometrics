import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cron from 'node-cron';
import { fileURLToPath } from 'url';
import path from 'path';
import logger from './utils/logger.js';
import storeConfig from './config/stores.config.js';
import WooCommerceClient from './services/woocommerce-client.js';
import MetricsCollector from './services/metrics-collector.js';

class WooCommercePrometheusExporter {
  constructor() {
    this.app = express();
    this.port = process.env.PORT || 9090;
    this.scrapeInterval = process.env.SCRAPE_INTERVAL || '*/5 * * * *'; // Every 5 minutes
    
    // Initialize services
    this.metricsCollector = new MetricsCollector();
    this.storeClients = new Map();
    this.cronJob = null;
    
    // Setup express middleware
    this.setupMiddleware();
    this.setupRoutes();
  }

  /**
   * Setup Express middleware
   */
  setupMiddleware() {
    // JSON body parser
    this.app.use(express.json());
    
    // Request logging
    this.app.use((req, res, next) => {
      logger.debug(`${req.method} ${req.path}`, { 
        ip: req.ip, 
        userAgent: req.get('User-Agent') 
      });
      next();
    });

    // Error handling middleware
    this.app.use((error, req, res, next) => {
      logger.error('Express error:', error.message);
      res.status(500).json({ 
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
      });
    });
  }

  /**
   * Setup Express routes
   */
  setupRoutes() {
    // Metrics endpoint for Prometheus
    this.app.get('/metrics', async (req, res) => {
      try {
        const metrics = await this.metricsCollector.getMetrics();
        res.set('Content-Type', 'text/plain');
        res.send(metrics);
      } catch (error) {
        logger.error('Error serving metrics:', error.message);
        res.status(500).json({ error: 'Failed to generate metrics' });
      }
    });

    // Health check endpoint
    this.app.get('/health', (req, res) => {
      const stores = storeConfig.getAllStores();
      const enabledStores = storeConfig.getEnabledStores();
      
      res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        stores: {
          total: stores.length,
          enabled: enabledStores.length,
          configured: stores.map(store => ({
            id: store.id,
            name: store.name,
            enabled: store.enabled,
            url: store.url.replace(/\/wp-json.*$/, '') // Hide sensitive parts
          }))
        },
        metrics: {
          lastCollection: this.lastCollectionTime || null,
          nextCollection: this.cronJob ? 'scheduled' : 'not scheduled'
        }
      });
    });

    // Manual collection trigger for all stores
    this.app.post('/collect', async (req, res) => {
      try {
        logger.info('Manual collection triggered for all stores');
        await this.collectAllMetrics();
        res.json({ 
          message: 'Metrics collection completed for all stores',
          timestamp: new Date().toISOString()
        });
      } catch (error) {
        logger.error('Manual collection failed:', error.message);
        res.status(500).json({ 
          error: 'Collection failed',
          message: error.message
        });
      }
    });

    // Manual collection trigger for specific store
    this.app.post('/collect/:storeId', async (req, res) => {
      try {
        const { storeId } = req.params;
        logger.info(`Manual collection triggered for store: ${storeId}`);
        
        await this.collectStoreMetrics(storeId);
        
        res.json({ 
          message: `Metrics collection completed for store: ${storeId}`,
          timestamp: new Date().toISOString()
        });
      } catch (error) {
        logger.error(`Manual collection failed for store ${req.params.storeId}:`, error.message);
        res.status(500).json({ 
          error: 'Collection failed',
          message: error.message
        });
      }
    });

    // List all configured stores
    this.app.get('/stores', (req, res) => {
      const stores = storeConfig.getAllStores();
      res.json({
        stores: stores.map(store => ({
          id: store.id,
          name: store.name,
          enabled: store.enabled,
          currency: store.currency,
          scrapeInterval: store.scrapeInterval,
          url: store.url.replace(/\/wp-json.*$/, ''), // Hide sensitive parts
          lastCollection: this.storeClients.has(store.id) ? 'initialized' : 'not initialized'
        })),
        total: stores.length,
        enabled: stores.filter(s => s.enabled).length
      });
    });

    // Test store connection
    this.app.post('/test/:storeId', async (req, res) => {
      try {
        const { storeId } = req.params;
        const client = this.storeClients.get(storeId);
        
        if (!client) {
          return res.status(404).json({ 
            error: 'Store not found',
            storeId 
          });
        }

        const isConnected = await client.testConnection();
        
        res.json({
          storeId,
          connected: isConnected,
          timestamp: new Date().toISOString()
        });
      } catch (error) {
        logger.error(`Connection test failed for store ${req.params.storeId}:`, error.message);
        res.status(500).json({ 
          error: 'Connection test failed',
          message: error.message
        });
      }
    });

    // Root endpoint
    this.app.get('/', (req, res) => {
      res.json({
        name: 'WooCommerce Prometheus Exporter',
        version: '1.0.0',
        endpoints: {
          metrics: '/metrics',
          health: '/health',
          stores: '/stores',
          collect_all: 'POST /collect',
          collect_store: 'POST /collect/:storeId',
          test_connection: 'POST /test/:storeId'
        },
        documentation: 'https://github.com/webxbeyond/woometrics'
      });
    });
  }

  /**
   * Initialize WooCommerce clients for all enabled stores
   */
  async initializeStores() {
    const stores = storeConfig.getEnabledStores();
    
    if (stores.length === 0) {
      logger.warn('No enabled stores found in configuration');
      return false;
    }

    logger.info(`Initializing ${stores.length} enabled stores`);

    // Validate store configurations
    const validationErrors = storeConfig.validateStores();
    if (validationErrors.length > 0) {
      logger.error('Store configuration validation failed:');
      validationErrors.forEach(error => logger.error(`  - ${error}`));
      throw new Error('Invalid store configuration');
    }

    // Initialize clients for each store
    for (const storeConf of stores) {
      try {
        const client = new WooCommerceClient(storeConf);
        this.storeClients.set(storeConf.id, client);
        
        // Test connection
        const isConnected = await client.testConnection();
        if (isConnected) {
          logger.info(`✓ Store ${storeConf.name} (${storeConf.id}) initialized successfully`);
        } else {
          logger.warn(`⚠ Store ${storeConf.name} (${storeConf.id}) initialized but connection test failed`);
        }
      } catch (error) {
        logger.error(`✗ Failed to initialize store ${storeConf.name} (${storeConf.id}):`, error.message);
        // Don't add failed stores to the map
      }
    }

    logger.info(`Successfully initialized ${this.storeClients.size} out of ${stores.length} stores`);
    return this.storeClients.size > 0;
  }

  /**
   * Collect metrics for all stores
   */
  async collectAllMetrics() {
    const startTime = Date.now();
    logger.info('Starting metrics collection for all stores');

    if (this.storeClients.size === 0) {
      logger.warn('No store clients available for metrics collection');
      return;
    }

    // Collect metrics for each store
    const collectionPromises = Array.from(this.storeClients.entries()).map(
      async ([storeId, client]) => {
        try {
          await this.metricsCollector.collectStoreMetrics(client);
          return { storeId, success: true };
        } catch (error) {
          logger.error(`Metrics collection failed for store ${storeId}:`, error.message);
          return { storeId, success: false, error: error.message };
        }
      }
    );

    // Wait for all collections to complete
    const results = await Promise.allSettled(collectionPromises);
    const completed = results.filter(r => r.status === 'fulfilled' && r.value.success).length;
    const failed = results.length - completed;

    const duration = (Date.now() - startTime) / 1000;
    this.lastCollectionTime = new Date().toISOString();

    logger.info(`Metrics collection completed: ${completed} successful, ${failed} failed in ${duration.toFixed(2)}s`);

    if (failed > 0) {
      logger.warn(`${failed} stores failed during metrics collection`);
    }
  }

  /**
   * Collect metrics for a specific store
   * @param {string} storeId - Store ID to collect metrics for
   */
  async collectStoreMetrics(storeId) {
    const client = this.storeClients.get(storeId);
    
    if (!client) {
      throw new Error(`Store ${storeId} not found or not initialized`);
    }

    logger.info(`Starting metrics collection for store: ${storeId}`);
    await this.metricsCollector.collectStoreMetrics(client);
    logger.info(`Metrics collection completed for store: ${storeId}`);
  }

  /**
   * Setup cron job for scheduled metrics collection
   */
  setupCronJob() {
    if (this.cronJob) {
      this.cronJob.stop();
    }

    // Validate cron expression
    if (!cron.validate(this.scrapeInterval)) {
      logger.error(`Invalid cron expression: ${this.scrapeInterval}`);
      throw new Error('Invalid scrape interval cron expression');
    }

    this.cronJob = cron.schedule(this.scrapeInterval, async () => {
      try {
        await this.collectAllMetrics();
      } catch (error) {
        logger.error('Scheduled metrics collection failed:', error.message);
      }
    }, {
      scheduled: false
    });

    logger.info(`Cron job scheduled with interval: ${this.scrapeInterval}`);
  }

  /**
   * Start the application
   */
  async start() {
    try {
      logger.info('Starting WooCommerce Prometheus Exporter');

      // Initialize stores
      const storesInitialized = await this.initializeStores();
      
      if (!storesInitialized) {
        logger.error('No stores could be initialized. Exiting.');
        process.exit(1);
      }

      // Collect initial metrics
      logger.info('Collecting initial metrics...');
      await this.collectAllMetrics();

      // Setup and start cron job
      this.setupCronJob();
      this.cronJob.start();
      logger.info('Cron job started for scheduled collections');

      // Start Express server
      this.server = this.app.listen(this.port, () => {
        logger.info(`🚀 Server started on port ${this.port}`);
        logger.info(`📊 Metrics endpoint: http://localhost:${this.port}/metrics`);
        logger.info(`💚 Health endpoint: http://localhost:${this.port}/health`);
        logger.info(`🏪 Stores endpoint: http://localhost:${this.port}/stores`);
        logger.info(`📅 Collection interval: ${this.scrapeInterval}`);
        logger.info(`🎯 Monitoring ${this.storeClients.size} WooCommerce stores`);
      });

    } catch (error) {
      logger.error('Application startup failed:', error.message);
      process.exit(1);
    }
  }

  /**
   * Graceful shutdown
   */
  async shutdown() {
    logger.info('Shutting down WooCommerce Prometheus Exporter...');

    // Stop cron job
    if (this.cronJob) {
      this.cronJob.stop();
      logger.info('Cron job stopped');
    }

    // Close HTTP server
    if (this.server) {
      await new Promise((resolve) => {
        this.server.close(resolve);
      });
      logger.info('HTTP server closed');
    }

    logger.info('Application shutdown complete');
  }
}

// Create application instance
const app = new WooCommercePrometheusExporter();

// Handle graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('Received SIGTERM signal');
  await app.shutdown();
  process.exit(0);
});

process.on('SIGINT', async () => {
  logger.info('Received SIGINT signal');
  await app.shutdown();
  process.exit(0);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Start the application
// Check if this module is being run directly (not imported)
const __filename = fileURLToPath(import.meta.url);
const isMainModule = process.argv[1] === __filename || path.resolve(process.argv[1]) === __filename;

if (isMainModule) {
  app.start().catch((error) => {
    logger.error('Failed to start application:', error.message);
    process.exit(1);
  });
}

export default app;
import client from 'prom-client';
import logger from '../utils/logger.js';

/**
 * Prometheus Metrics Collector for WooCommerce stores
 */
class MetricsCollector {
  constructor() {
    // Create a Registry which registers the metrics
    this.register = new client.Registry();
    
    // Add a default label which is added to all metrics
    this.register.setDefaultLabels({
      app: 'woocommerce-prometheus-exporter'
    });

    // Initialize all metrics
    this.initializeMetrics();
    
    logger.info('MetricsCollector initialized with all Prometheus metrics');
  }

  /**
   * Initialize all Prometheus metrics
   */
  initializeMetrics() {
    // Total orders by status and currency
    this.totalOrdersGauge = new client.Gauge({
      name: 'woocommerce_total_orders',
      help: 'Total number of orders',
      labelNames: ['store_id', 'store_name', 'status', 'currency'],
      registers: [this.register]
    });

    // Orders by status
    this.ordersByStatusGauge = new client.Gauge({
      name: 'woocommerce_orders_by_status',
      help: 'Number of orders by status',
      labelNames: ['store_id', 'store_name', 'status', 'currency'],
      registers: [this.register]
    });

    // Total revenue
    this.totalRevenueGauge = new client.Gauge({
      name: 'woocommerce_total_revenue',
      help: 'Total revenue amount',
      labelNames: ['store_id', 'store_name', 'currency', 'period'],
      registers: [this.register]
    });

    // Revenue today
    this.revenueTodayGauge = new client.Gauge({
      name: 'woocommerce_revenue_today',
      help: 'Revenue for today',
      labelNames: ['store_id', 'store_name', 'currency'],
      registers: [this.register]
    });

    // Revenue this month
    this.revenueThisMonthGauge = new client.Gauge({
      name: 'woocommerce_revenue_this_month',
      help: 'Revenue for this month',
      labelNames: ['store_id', 'store_name', 'currency'],
      registers: [this.register]
    });

    // Total products
    this.totalProductsGauge = new client.Gauge({
      name: 'woocommerce_total_products',
      help: 'Total number of products',
      labelNames: ['store_id', 'store_name', 'status'],
      registers: [this.register]
    });

    // Low stock products
    this.lowStockProductsGauge = new client.Gauge({
      name: 'woocommerce_low_stock_products',
      help: 'Number of products with low stock',
      labelNames: ['store_id', 'store_name', 'threshold'],
      registers: [this.register]
    });

    // Out of stock products
    this.outOfStockProductsGauge = new client.Gauge({
      name: 'woocommerce_out_of_stock_products',
      help: 'Number of products out of stock',
      labelNames: ['store_id', 'store_name'],
      registers: [this.register]
    });

    // Total customers
    this.totalCustomersGauge = new client.Gauge({
      name: 'woocommerce_total_customers',
      help: 'Total number of customers',
      labelNames: ['store_id', 'store_name'],
      registers: [this.register]
    });

    // Average order value
    this.averageOrderValueGauge = new client.Gauge({
      name: 'woocommerce_average_order_value',
      help: 'Average order value',
      labelNames: ['store_id', 'store_name', 'currency', 'period'],
      registers: [this.register]
    });

    // Pending orders
    this.pendingOrdersGauge = new client.Gauge({
      name: 'woocommerce_pending_orders',
      help: 'Number of pending orders',
      labelNames: ['store_id', 'store_name'],
      registers: [this.register]
    });

    // Failed orders
    this.failedOrdersGauge = new client.Gauge({
      name: 'woocommerce_failed_orders',
      help: 'Number of failed orders',
      labelNames: ['store_id', 'store_name'],
      registers: [this.register]
    });

    // Processing orders
    this.processingOrdersGauge = new client.Gauge({
      name: 'woocommerce_processing_orders',
      help: 'Number of processing orders',
      labelNames: ['store_id', 'store_name'],
      registers: [this.register]
    });

    // Top products sold
    this.topProductsSoldGauge = new client.Gauge({
      name: 'woocommerce_top_products_sold',
      help: 'Top selling products by quantity',
      labelNames: ['store_id', 'store_name', 'product_id', 'product_name'],
      registers: [this.register]
    });

    // Last scrape success timestamp
    this.lastScrapeSuccessGauge = new client.Gauge({
      name: 'woocommerce_last_scrape_success',
      help: 'Timestamp of last successful scrape',
      labelNames: ['store_id', 'store_name'],
      registers: [this.register]
    });

    // Scrape errors counter
    this.scrapeErrorsCounter = new client.Counter({
      name: 'woocommerce_scrape_errors_total',
      help: 'Total number of scrape errors',
      labelNames: ['store_id', 'store_name', 'error_type'],
      registers: [this.register]
    });

    // Scrape duration
    this.scrapeDurationGauge = new client.Gauge({
      name: 'woocommerce_scrape_duration_seconds',
      help: 'Duration of last scrape in seconds',
      labelNames: ['store_id', 'store_name'],
      registers: [this.register]
    });

    // API response time
    this.apiResponseTimeGauge = new client.Gauge({
      name: 'woocommerce_api_response_time_seconds',
      help: 'WooCommerce API response time in seconds',
      labelNames: ['store_id', 'store_name', 'endpoint'],
      registers: [this.register]
    });
  }

  /**
   * Collect all metrics for a store
   * @param {WooCommerceClient} wooClient - WooCommerce client instance
   */
  async collectStoreMetrics(wooClient) {
    const startTime = Date.now();
    const storeInfo = wooClient.getStoreInfo();
    const { id: storeId, name: storeName, currency } = storeInfo;

    try {
      logger.info(`Starting metrics collection for store: ${storeName} (${storeId})`);

      // Collect all metrics in parallel where possible
      await Promise.allSettled([
        this.collectOrderMetrics(wooClient),
        this.collectProductMetrics(wooClient),
        this.collectCustomerMetrics(wooClient)
      ]);

      // Update last scrape success timestamp
      this.lastScrapeSuccessGauge.set(
        { store_id: storeId, store_name: storeName },
        Math.floor(Date.now() / 1000)
      );

      // Update scrape duration
      const duration = (Date.now() - startTime) / 1000;
      this.scrapeDurationGauge.set(
        { store_id: storeId, store_name: storeName },
        duration
      );

      logger.info(`Completed metrics collection for store: ${storeName} (${storeId}) in ${duration.toFixed(2)}s`);

    } catch (error) {
      logger.error(`Error collecting metrics for store ${storeId}:`, error.message);
      
      // Increment error counter
      this.scrapeErrorsCounter.inc({
        store_id: storeId,
        store_name: storeName,
        error_type: 'general'
      });

      throw error;
    }
  }

  /**
   * Collect order-related metrics
   * @param {WooCommerceClient} wooClient - WooCommerce client instance
   */
  async collectOrderMetrics(wooClient) {
    const storeInfo = wooClient.getStoreInfo();
    const { id: storeId, name: storeName, currency } = storeInfo;
    const apiStartTime = Date.now();

    try {
      logger.debug(`Collecting order metrics for store ${storeId}`);

      // Get all orders (limit to recent ones for performance)
      const orders = await wooClient.getAllOrders({
        after: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString() // Last 90 days
      });

      // Track API response time
      const apiDuration = (Date.now() - apiStartTime) / 1000;
      this.apiResponseTimeGauge.set(
        { store_id: storeId, store_name: storeName, endpoint: 'orders' },
        apiDuration
      );

      // Initialize counters
      const statusCounts = {};
      const today = new Date().toDateString();
      const thisMonth = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`;
      
      let totalRevenue = 0;
      let revenueToday = 0;
      let revenueThisMonth = 0;
      let totalOrderValue = 0;
      const productSales = {};

      // Process each order
      orders.forEach(order => {
        const status = order.status;
        const orderDate = new Date(order.date_created);
        const orderDateString = orderDate.toDateString();
        const orderMonth = `${orderDate.getFullYear()}-${String(orderDate.getMonth() + 1).padStart(2, '0')}`;
        const orderTotal = parseFloat(order.total) || 0;

        // Count by status
        statusCounts[status] = (statusCounts[status] || 0) + 1;

        // Calculate revenue (only for completed orders)
        if (status === 'completed') {
          totalRevenue += orderTotal;
          totalOrderValue += orderTotal;

          if (orderDateString === today) {
            revenueToday += orderTotal;
          }

          if (orderMonth === thisMonth) {
            revenueThisMonth += orderTotal;
          }
        }

        // Track product sales
        if (order.line_items) {
          order.line_items.forEach(item => {
            const productId = item.product_id.toString();
            const productName = item.name;
            const quantity = parseInt(item.quantity) || 0;

            if (!productSales[productId]) {
              productSales[productId] = {
                name: productName,
                quantity: 0
              };
            }
            productSales[productId].quantity += quantity;
          });
        }
      });

      // Set total orders metric
      this.totalOrdersGauge.set(
        { store_id: storeId, store_name: storeName, status: 'all', currency },
        orders.length
      );

      // Set orders by status metrics
      Object.entries(statusCounts).forEach(([status, count]) => {
        this.ordersByStatusGauge.set(
          { store_id: storeId, store_name: storeName, status, currency },
          count
        );
      });

      // Set specific status metrics
      this.pendingOrdersGauge.set(
        { store_id: storeId, store_name: storeName },
        statusCounts['pending'] || 0
      );

      this.failedOrdersGauge.set(
        { store_id: storeId, store_name: storeName },
        statusCounts['failed'] || 0
      );

      this.processingOrdersGauge.set(
        { store_id: storeId, store_name: storeName },
        statusCounts['processing'] || 0
      );

      // Set revenue metrics
      this.totalRevenueGauge.set(
        { store_id: storeId, store_name: storeName, currency, period: 'all_time' },
        totalRevenue
      );

      this.revenueTodayGauge.set(
        { store_id: storeId, store_name: storeName, currency },
        revenueToday
      );

      this.revenueThisMonthGauge.set(
        { store_id: storeId, store_name: storeName, currency },
        revenueThisMonth
      );

      // Calculate average order value
      const completedOrders = statusCounts['completed'] || 0;
      const avgOrderValue = completedOrders > 0 ? totalOrderValue / completedOrders : 0;
      
      this.averageOrderValueGauge.set(
        { store_id: storeId, store_name: storeName, currency, period: 'all_time' },
        avgOrderValue
      );

      // Set top products metrics (top 10)
      const topProducts = Object.entries(productSales)
        .sort(([,a], [,b]) => b.quantity - a.quantity)
        .slice(0, 10);

      topProducts.forEach(([productId, data]) => {
        this.topProductsSoldGauge.set(
          { store_id: storeId, store_name: storeName, product_id: productId, product_name: data.name },
          data.quantity
        );
      });

      logger.debug(`Order metrics collected for store ${storeId}: ${orders.length} orders, $${totalRevenue.toFixed(2)} revenue`);

    } catch (error) {
      logger.error(`Error collecting order metrics for store ${storeId}:`, error.message);
      
      this.scrapeErrorsCounter.inc({
        store_id: storeId,
        store_name: storeName,
        error_type: 'orders'
      });

      throw error;
    }
  }

  /**
   * Collect product-related metrics
   * @param {WooCommerceClient} wooClient - WooCommerce client instance
   */
  async collectProductMetrics(wooClient) {
    const storeInfo = wooClient.getStoreInfo();
    const { id: storeId, name: storeName } = storeInfo;
    const apiStartTime = Date.now();

    try {
      logger.debug(`Collecting product metrics for store ${storeId}`);

      // Get all products
      const products = await wooClient.getAllProducts();

      // Track API response time
      const apiDuration = (Date.now() - apiStartTime) / 1000;
      this.apiResponseTimeGauge.set(
        { store_id: storeId, store_name: storeName, endpoint: 'products' },
        apiDuration
      );

      // Initialize counters
      const statusCounts = {};
      let lowStockCount = 0;
      let outOfStockCount = 0;
      const lowStockThreshold = 10; // Consider products with <= 10 items as low stock

      // Process each product
      products.forEach(product => {
        const status = product.status;
        const stockQuantity = parseInt(product.stock_quantity) || 0;
        const stockStatus = product.stock_status;

        // Count by status
        statusCounts[status] = (statusCounts[status] || 0) + 1;

        // Check stock levels
        if (stockStatus === 'outofstock' || stockQuantity === 0) {
          outOfStockCount++;
        } else if (product.manage_stock && stockQuantity <= lowStockThreshold) {
          lowStockCount++;
        }
      });

      // Set product metrics
      this.totalProductsGauge.set(
        { store_id: storeId, store_name: storeName, status: 'all' },
        products.length
      );

      // Set products by status
      Object.entries(statusCounts).forEach(([status, count]) => {
        this.totalProductsGauge.set(
          { store_id: storeId, store_name: storeName, status },
          count
        );
      });

      // Set stock metrics
      this.lowStockProductsGauge.set(
        { store_id: storeId, store_name: storeName, threshold: lowStockThreshold.toString() },
        lowStockCount
      );

      this.outOfStockProductsGauge.set(
        { store_id: storeId, store_name: storeName },
        outOfStockCount
      );

      logger.debug(`Product metrics collected for store ${storeId}: ${products.length} products, ${lowStockCount} low stock, ${outOfStockCount} out of stock`);

    } catch (error) {
      logger.error(`Error collecting product metrics for store ${storeId}:`, error.message);
      
      this.scrapeErrorsCounter.inc({
        store_id: storeId,
        store_name: storeName,
        error_type: 'products'
      });

      throw error;
    }
  }

  /**
   * Collect customer-related metrics
   * @param {WooCommerceClient} wooClient - WooCommerce client instance
   */
  async collectCustomerMetrics(wooClient) {
    const storeInfo = wooClient.getStoreInfo();
    const { id: storeId, name: storeName } = storeInfo;
    const apiStartTime = Date.now();

    try {
      logger.debug(`Collecting customer metrics for store ${storeId}`);

      // Get customer count (just first page to get total from headers if available)
      const customers = await wooClient.getCustomers({ per_page: 1 });
      
      // Track API response time
      const apiDuration = (Date.now() - apiStartTime) / 1000;
      this.apiResponseTimeGauge.set(
        { store_id: storeId, store_name: storeName, endpoint: 'customers' },
        apiDuration
      );

      // For a more accurate count, we'd need to paginate through all customers
      // But for now, we'll use a simple approach
      let totalCustomers = 0;
      try {
        // Try to get all customers (this might be expensive for large stores)
        const allCustomers = await wooClient.getCustomers({ per_page: 100 });
        totalCustomers = allCustomers.length;
        
        // If we got exactly 100, there might be more
        if (allCustomers.length === 100) {
          // Do a quick count by getting multiple pages
          let page = 2;
          let hasMore = true;
          while (hasMore && page <= 10) { // Limit to first 10 pages for performance
            const pageCustomers = await wooClient.getCustomers({ per_page: 100, page });
            if (pageCustomers.length === 0) {
              hasMore = false;
            } else {
              totalCustomers += pageCustomers.length;
              page++;
            }
          }
        }
      } catch (error) {
        // If we can't get all customers, just use what we have
        logger.warn(`Could not get full customer count for store ${storeId}, using partial count`);
        totalCustomers = customers.length;
      }

      // Set customer metrics
      this.totalCustomersGauge.set(
        { store_id: storeId, store_name: storeName },
        totalCustomers
      );

      logger.debug(`Customer metrics collected for store ${storeId}: ${totalCustomers} customers`);

    } catch (error) {
      logger.error(`Error collecting customer metrics for store ${storeId}:`, error.message);
      
      this.scrapeErrorsCounter.inc({
        store_id: storeId,
        store_name: storeName,
        error_type: 'customers'
      });

      throw error;
    }
  }

  /**
   * Get formatted metrics string for Prometheus
   * @returns {string} Formatted metrics
   */
  async getMetrics() {
    try {
      return await this.register.metrics();
    } catch (error) {
      logger.error('Error getting metrics:', error.message);
      throw error;
    }
  }

  /**
   * Clear all metrics (useful for testing)
   */
  clearMetrics() {
    this.register.clear();
    this.initializeMetrics();
    logger.info('All metrics cleared and reinitialized');
  }

  /**
   * Get registry for custom usage
   * @returns {Registry} Prometheus registry
   */
  getRegistry() {
    return this.register;
  }
}

export default MetricsCollector;
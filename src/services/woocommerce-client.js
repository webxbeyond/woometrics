import WooCommerceRestApiModule from '@woocommerce/woocommerce-rest-api';
import logger from '../utils/logger.js';

// Handle ESM import for WooCommerce API - it has nested default exports
const WooCommerceRestApi = WooCommerceRestApiModule.default?.default || WooCommerceRestApiModule.default || WooCommerceRestApiModule;

/**
 * WooCommerce API Client for fetching store data
 */
class WooCommerceClient {
  constructor(storeConfig) {
    this.storeConfig = storeConfig;
    this.storeId = storeConfig.id;
    this.storeName = storeConfig.name;
    
    // Initialize WooCommerce REST API client
    this.api = new WooCommerceRestApi({
      url: storeConfig.url,
      consumerKey: storeConfig.consumerKey,
      consumerSecret: storeConfig.consumerSecret,
      version: 'wc/v3',
      queryStringAuth: true,
      timeout: storeConfig.timeout || 30000
    });

    logger.info(`WooCommerce client initialized for store: ${this.storeName} (${this.storeId})`);
  }

  /**
   * Get orders with optional parameters
   * @param {Object} params - Query parameters for orders
   * @returns {Promise<Array>} Array of orders
   */
  async getOrders(params = {}) {
    try {
      const defaultParams = {
        per_page: 100,
        page: 1,
        ...params
      };

      logger.debug(`Fetching orders for store ${this.storeId}`, { params: defaultParams });
      
      const response = await this.api.get('orders', defaultParams);
      
      logger.debug(`Retrieved ${response.data.length} orders for store ${this.storeId}`);
      return response.data;
      
    } catch (error) {
      logger.error(`Error fetching orders for store ${this.storeId}:`, {
        error: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText
      });
      throw error;
    }
  }

  /**
   * Get all orders with pagination
   * @param {Object} params - Query parameters
   * @returns {Promise<Array>} All orders
   */
  async getAllOrders(params = {}) {
    try {
      const allOrders = [];
      let page = 1;
      let hasMore = true;

      while (hasMore) {
        const pageParams = { ...params, page, per_page: 100 };
        const orders = await this.getOrders(pageParams);
        
        if (orders.length === 0) {
          hasMore = false;
        } else {
          allOrders.push(...orders);
          page++;
          
          // Safety limit to prevent infinite loops
          if (page > 100) {
            logger.warn(`Reached page limit (100) for orders in store ${this.storeId}`);
            break;
          }
        }
      }

      logger.info(`Retrieved total of ${allOrders.length} orders for store ${this.storeId}`);
      return allOrders;
      
    } catch (error) {
      logger.error(`Error fetching all orders for store ${this.storeId}:`, error.message);
      throw error;
    }
  }

  /**
   * Get products with optional parameters
   * @param {Object} params - Query parameters for products  
   * @returns {Promise<Array>} Array of products
   */
  async getProducts(params = {}) {
    try {
      const defaultParams = {
        per_page: 100,
        page: 1,
        ...params
      };

      logger.debug(`Fetching products for store ${this.storeId}`, { params: defaultParams });
      
      const response = await this.api.get('products', defaultParams);
      
      logger.debug(`Retrieved ${response.data.length} products for store ${this.storeId}`);
      return response.data;
      
    } catch (error) {
      logger.error(`Error fetching products for store ${this.storeId}:`, {
        error: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText
      });
      throw error;
    }
  }

  /**
   * Get all products with pagination
   * @param {Object} params - Query parameters
   * @returns {Promise<Array>} All products
   */
  async getAllProducts(params = {}) {
    try {
      const allProducts = [];
      let page = 1;
      let hasMore = true;

      while (hasMore) {
        const pageParams = { ...params, page, per_page: 100 };
        const products = await this.getProducts(pageParams);
        
        if (products.length === 0) {
          hasMore = false;
        } else {
          allProducts.push(...products);
          page++;
          
          // Safety limit to prevent infinite loops
          if (page > 100) {
            logger.warn(`Reached page limit (100) for products in store ${this.storeId}`);
            break;
          }
        }
      }

      logger.info(`Retrieved total of ${allProducts.length} products for store ${this.storeId}`);
      return allProducts;
      
    } catch (error) {
      logger.error(`Error fetching all products for store ${this.storeId}:`, error.message);
      throw error;
    }
  }

  /**
   * Get customers with optional parameters
   * @param {Object} params - Query parameters for customers
   * @returns {Promise<Array>} Array of customers
   */
  async getCustomers(params = {}) {
    try {
      const defaultParams = {
        per_page: 100,
        page: 1,
        ...params
      };

      logger.debug(`Fetching customers for store ${this.storeId}`, { params: defaultParams });
      
      const response = await this.api.get('customers', defaultParams);
      
      logger.debug(`Retrieved ${response.data.length} customers for store ${this.storeId}`);
      return response.data;
      
    } catch (error) {
      logger.error(`Error fetching customers for store ${this.storeId}:`, {
        error: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText
      });
      throw error;
    }
  }

  /**
   * Get sales reports/stats
   * @param {Object} params - Query parameters for reports
   * @returns {Promise<Object>} Sales report data
   */
  async getOrderStats(params = {}) {
    try {
      logger.debug(`Fetching order stats for store ${this.storeId}`, { params });
      
      const response = await this.api.get('reports/sales', params);
      
      logger.debug(`Retrieved order stats for store ${this.storeId}`, response.data);
      return response.data;
      
    } catch (error) {
      logger.error(`Error fetching order stats for store ${this.storeId}:`, {
        error: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText
      });
      throw error;
    }
  }

  /**
   * Get coupons
   * @param {Object} params - Query parameters for coupons
   * @returns {Promise<Array>} Array of coupons
   */
  async getCoupons(params = {}) {
    try {
      const defaultParams = {
        per_page: 100,
        page: 1,
        ...params
      };

      logger.debug(`Fetching coupons for store ${this.storeId}`, { params: defaultParams });
      
      const response = await this.api.get('coupons', defaultParams);
      
      logger.debug(`Retrieved ${response.data.length} coupons for store ${this.storeId}`);
      return response.data;
      
    } catch (error) {
      logger.error(`Error fetching coupons for store ${this.storeId}:`, {
        error: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText
      });
      throw error;
    }
  }

  /**
   * Test API connectivity
   * @returns {Promise<boolean>} True if connection successful
   */
  async testConnection() {
    try {
      logger.info(`Testing connection for store ${this.storeId}`);
      
      // Try to fetch system status to test connection
      await this.api.get('system_status');
      
      logger.info(`Connection test successful for store ${this.storeId}`);
      return true;
      
    } catch (error) {
      logger.error(`Connection test failed for store ${this.storeId}:`, {
        error: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText
      });
      return false;
    }
  }

  /**
   * Get store info
   * @returns {Promise<Object>} Store information
   */
  getStoreInfo() {
    return {
      id: this.storeId,
      name: this.storeName,
      url: this.storeConfig.url,
      currency: this.storeConfig.currency,
      enabled: this.storeConfig.enabled,
      scrapeInterval: this.storeConfig.scrapeInterval
    };
  }
}

export default WooCommerceClient;
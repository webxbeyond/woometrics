import dotenv from 'dotenv';
dotenv.config();

/**
 * Store configuration for multiple WooCommerce stores
 * Each store is configured via environment variables
 */
class StoreConfig {
  constructor() {
    this.stores = this.loadStoreConfigurations();
  }

  /**
   * Load store configurations from environment variables
   * @returns {Array} Array of store configuration objects
   */
  loadStoreConfigurations() {
    const stores = [];
    let storeIndex = 1;

    // Keep checking for stores until we don't find any more
    while (true) {
      const storeUrl = process.env[`STORE${storeIndex}_URL`];
      const consumerKey = process.env[`STORE${storeIndex}_CONSUMER_KEY`];
      const consumerSecret = process.env[`STORE${storeIndex}_CONSUMER_SECRET`];

      // If we don't have the required config, stop looking
      if (!storeUrl || !consumerKey || !consumerSecret) {
        break;
      }

      const store = {
        id: `store${storeIndex}`,
        name: process.env[`STORE${storeIndex}_NAME`] || `Store ${storeIndex}`,
        url: storeUrl,
        consumerKey: consumerKey,
        consumerSecret: consumerSecret,
        enabled: process.env[`STORE${storeIndex}_ENABLED`] !== 'false', // Default to true
        scrapeInterval: parseInt(process.env[`STORE${storeIndex}_SCRAPE_INTERVAL`]) || 300000, // 5 minutes default
        currency: process.env[`STORE${storeIndex}_CURRENCY`] || 'USD',
        timeout: parseInt(process.env[`STORE${storeIndex}_TIMEOUT`]) || 30000, // 30 seconds default
        maxRetries: parseInt(process.env[`STORE${storeIndex}_MAX_RETRIES`]) || 3
      };

      stores.push(store);
      storeIndex++;
    }

    return stores;
  }

  /**
   * Get all configured stores
   * @returns {Array} Array of store configurations
   */
  getAllStores() {
    return this.stores;
  }

  /**
   * Get only enabled stores
   * @returns {Array} Array of enabled store configurations
   */
  getEnabledStores() {
    return this.stores.filter(store => store.enabled);
  }

  /**
   * Get store configuration by ID
   * @param {string} storeId - Store ID to find
   * @returns {Object|null} Store configuration or null if not found
   */
  getStoreById(storeId) {
    return this.stores.find(store => store.id === storeId) || null;
  }

  /**
   * Get store count
   * @returns {number} Total number of configured stores
   */
  getStoreCount() {
    return this.stores.length;
  }

  /**
   * Get enabled store count
   * @returns {number} Number of enabled stores
   */
  getEnabledStoreCount() {
    return this.stores.filter(store => store.enabled).length;
  }

  /**
   * Validate store configurations
   * @returns {Array} Array of validation errors (empty if all valid)
   */
  validateStores() {
    const errors = [];

    this.stores.forEach(store => {
      // Check required fields
      if (!store.url) {
        errors.push(`Store ${store.id}: URL is required`);
      }
      if (!store.consumerKey) {
        errors.push(`Store ${store.id}: Consumer Key is required`);
      }
      if (!store.consumerSecret) {
        errors.push(`Store ${store.id}: Consumer Secret is required`);
      }

      // Validate URL format
      if (store.url && !store.url.startsWith('http')) {
        errors.push(`Store ${store.id}: URL must start with http:// or https://`);
      }

      // Validate scrape interval (minimum 1 minute)
      if (store.scrapeInterval < 60000) {
        errors.push(`Store ${store.id}: Scrape interval must be at least 60000ms (1 minute)`);
      }

      // Validate timeout (minimum 5 seconds)
      if (store.timeout < 5000) {
        errors.push(`Store ${store.id}: Timeout must be at least 5000ms (5 seconds)`);
      }
    });

    return errors;
  }
}

// Create and export singleton instance
const storeConfig = new StoreConfig();

export default storeConfig;
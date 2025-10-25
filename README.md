# WooCommerce Prometheus Exporter

> 🚀 **A production-ready Node.js application that exports comprehensive metrics from multiple WooCommerce stores to Prometheus for monitoring and alerting.**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org/)
[![Docker](https://img.shields.io/badge/docker-supported-blue.svg)](https://www.docker.com/)
[![GitHub release](https://img.shields.io/github/release/webxbeyond/woometrics.svg)](https://github.com/webxbeyond/woometrics/releases)
[![Build Status](https://github.com/webxbeyond/woometrics/workflows/CI/badge.svg)](https://github.com/webxbeyond/woometrics/actions)
[![Docker Pulls](https://img.shields.io/docker/pulls/webxbeyond/woometrics.svg)](https://hub.docker.com/r/webxbeyond/woometrics)
[![Contributors](https://img.shields.io/github/contributors/webxbeyond/woometrics.svg)](https://github.com/webxbeyond/woometrics/graphs/contributors)

## 🌟 Why WooMetrics?

Transform your WooCommerce monitoring with enterprise-grade metrics collection and alerting. Get real-time insights into your e-commerce performance, inventory management, and customer behavior - all integrated seamlessly with your existing Prometheus and Grafana stack.

## 📋 Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [Metrics](#metrics)
- [Docker Deployment](#docker-deployment)
- [Prometheus Queries](#prometheus-queries)
- [Grafana Dashboards](#grafana-dashboards)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)

## ✨ Features

- **Multi-Store Support**: Monitor unlimited WooCommerce stores from a single instance
- **Comprehensive Metrics**: Track orders, revenue, products, customers, and stock levels
- **Scheduled Collection**: Automated metrics collection via configurable cron jobs
- **Manual Triggers**: REST API endpoints for on-demand metrics collection
- **Docker Ready**: Complete Docker Compose setup with Prometheus and Grafana
- **Health Monitoring**: Built-in health checks and connection testing
- **Error Tracking**: Detailed error logging and metrics for failed operations
- **Flexible Configuration**: Environment-based configuration for easy deployment

## 📋 Prerequisites

- Node.js 18.0.0 or higher (required for ES Modules support)
- WooCommerce store(s) with REST API enabled
- WooCommerce API credentials (Consumer Key & Consumer Secret)
- Docker and Docker Compose (optional, for containerized deployment)

## 🚀 Installation

### Local Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/webxbeyond/woometrics.git
   cd woometrics
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Copy environment template**
   ```bash
   cp .env.example .env
   ```

4. **Configure your stores** (see [Configuration](#configuration))

5. **Start the application**
   ```bash
   # Development mode with auto-reload
   npm run dev
   
   # Production mode
   npm start
   ```

### Docker Installation

1. **Clone and configure**
   ```bash
   git clone https://github.com/webxbeyond/woometrics.git
   cd woometrics
   cp .env.example .env
   # Edit .env with your store configurations
   ```

2. **Start with Docker Compose**
   ```bash
   docker-compose up -d
   ```

## ⚙️ Configuration

### Environment Variables

Configure your WooCommerce stores by editing the `.env` file:

```env
# Server Configuration
PORT=9090
LOG_LEVEL=info
SCRAPE_INTERVAL=*/5 * * * *

# Store 1 Configuration
STORE1_NAME=My WooCommerce Store
STORE1_URL=https://your-store.com
STORE1_CONSUMER_KEY=ck_your_consumer_key_here
STORE1_CONSUMER_SECRET=cs_your_consumer_secret_here
STORE1_ENABLED=true
STORE1_CURRENCY=USD
STORE1_SCRAPE_INTERVAL=300000
STORE1_TIMEOUT=30000
STORE1_MAX_RETRIES=3

# Add more stores (STORE2_, STORE3_, etc.)
```

### Configuration Options

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `PORT` | HTTP server port | `9090` | No |
| `LOG_LEVEL` | Logging level (error, warn, info, debug) | `info` | No |
| `SCRAPE_INTERVAL` | Cron expression for collection schedule | `*/5 * * * *` | No |
| `STORE{N}_NAME` | Display name for the store | `Store {N}` | No |
| `STORE{N}_URL` | WooCommerce store URL | - | **Yes** |
| `STORE{N}_CONSUMER_KEY` | WooCommerce API Consumer Key | - | **Yes** |
| `STORE{N}_CONSUMER_SECRET` | WooCommerce API Consumer Secret | - | **Yes** |
| `STORE{N}_ENABLED` | Enable/disable store monitoring | `true` | No |
| `STORE{N}_CURRENCY` | Store currency code | `USD` | No |
| `STORE{N}_SCRAPE_INTERVAL` | Store-specific scrape interval (ms) | `300000` | No |
| `STORE{N}_TIMEOUT` | API request timeout (ms) | `30000` | No |
| `STORE{N}_MAX_RETRIES` | API request retry attempts | `3` | No |

### Getting WooCommerce API Credentials

1. Log in to your WooCommerce admin panel
2. Go to **WooCommerce → Settings → Advanced → REST API**
3. Click **Add Key**
4. Fill in the details:
   - **Description**: "Prometheus Exporter"
   - **User**: Select an administrator user
   - **Permissions**: Read
5. Click **Generate API Key**
6. Copy the **Consumer Key** and **Consumer Secret**

## 🏃 Running the Application

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

### Docker Mode
```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f woocommerce-exporter

# Stop services
docker-compose down
```

## 🔌 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/` | GET | Application info and available endpoints |
| `/health` | GET | Health check and store status |
| `/metrics` | GET | Prometheus metrics (for scraping) |
| `/stores` | GET | List all configured stores |
| `/collect` | POST | Trigger collection for all stores |
| `/collect/:storeId` | POST | Trigger collection for specific store |
| `/test/:storeId` | POST | Test connection to specific store |

### Example API Usage

```bash
# Check application health
curl http://localhost:9090/health

# List configured stores
curl http://localhost:9090/stores

# Manually trigger metrics collection
curl -X POST http://localhost:9090/collect

# Test store connection
curl -X POST http://localhost:9090/test/store1

# Get Prometheus metrics
curl http://localhost:9090/metrics
```

## 📊 Metrics

The exporter provides comprehensive WooCommerce metrics:

### Order Metrics
- `woocommerce_total_orders` - Total number of orders by status and currency
- `woocommerce_orders_by_status` - Orders grouped by status
- `woocommerce_pending_orders` - Number of pending orders
- `woocommerce_processing_orders` - Number of processing orders
- `woocommerce_failed_orders` - Number of failed orders

### Revenue Metrics
- `woocommerce_total_revenue` - Total revenue by currency and period
- `woocommerce_revenue_today` - Today's revenue
- `woocommerce_revenue_this_month` - This month's revenue
- `woocommerce_average_order_value` - Average order value by period

### Product Metrics
- `woocommerce_total_products` - Total number of products by status
- `woocommerce_low_stock_products` - Products with low stock
- `woocommerce_out_of_stock_products` - Products out of stock
- `woocommerce_top_products_sold` - Top selling products by quantity

### Customer Metrics
- `woocommerce_total_customers` - Total number of customers

### System Metrics
- `woocommerce_last_scrape_success` - Timestamp of last successful scrape
- `woocommerce_scrape_errors_total` - Total scrape errors by type
- `woocommerce_scrape_duration_seconds` - Duration of last scrape
- `woocommerce_api_response_time_seconds` - API response times by endpoint

### Metric Labels

All metrics include these labels for multi-store identification:
- `store_id` - Unique store identifier
- `store_name` - Human-readable store name
- Additional labels vary by metric (currency, status, product_id, etc.)

## 🐳 Docker Deployment

The project includes a complete Docker Compose setup with:

- **WooCommerce Exporter** (port 9090)
- **Prometheus** (port 9091)
- **Grafana** (port 3001)
- **Node Exporter** (port 9100) - for system metrics

### Quick Start

```bash
# Clone and setup
git clone https://github.com/webxbeyond/woometrics.git
cd woometrics
cp .env.example .env

# Edit .env with your store configurations
nano .env

# Start all services
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f
```

### Service URLs

- **Exporter**: http://localhost:9090
- **Prometheus**: http://localhost:9091
- **Grafana**: http://localhost:3001 (admin/admin123)

## 📈 Prometheus Queries

Here are some useful Prometheus queries for monitoring your WooCommerce stores:

### Revenue Queries
```promql
# Total revenue across all stores
sum(woocommerce_total_revenue{period="all_time"})

# Today's revenue by store
woocommerce_revenue_today

# Revenue growth rate (month over month)
increase(woocommerce_revenue_this_month[30d])
```

### Order Queries
```promql
# Total orders by status
sum by (status) (woocommerce_orders_by_status)

# Processing orders that need attention
woocommerce_processing_orders > 10

# Failed orders requiring investigation
woocommerce_failed_orders > 0
```

### Product Queries
```promql
# Low stock products across all stores
sum(woocommerce_low_stock_products)

# Out of stock products
sum(woocommerce_out_of_stock_products)

# Top selling products
topk(10, woocommerce_top_products_sold)
```

### System Health Queries
```promql
# Stores with recent scrape failures
time() - woocommerce_last_scrape_success > 900

# API response time by endpoint
avg by (endpoint) (woocommerce_api_response_time_seconds)

# Error rate by store
rate(woocommerce_scrape_errors_total[5m])
```

## 📊 Grafana Dashboards

### Pre-built Dashboard Features

The included Grafana dashboards provide:

1. **Store Overview**
   - Revenue trends and comparisons
   - Order status distribution
   - Customer growth metrics

2. **Inventory Management**
   - Stock level monitoring
   - Low stock alerts
   - Product performance metrics

3. **System Health**
   - Scrape success rates
   - API response times
   - Error tracking and alerts

### Importing Dashboards

1. Access Grafana at http://localhost:3001
2. Login with `admin`/`admin123`
3. Go to **+ → Import**
4. Upload the dashboard JSON files from `/grafana/dashboards/`

## 🔧 Troubleshooting

### Common Issues

#### 1. "No stores could be initialized"
**Cause**: Invalid store configuration or missing credentials.

**Solution**:
```bash
# Check your .env file
cat .env

# Test individual store connection
curl -X POST http://localhost:9090/test/store1

# Check logs for specific errors
tail -f logs/error.log
```

#### 2. "Connection test failed"
**Cause**: Incorrect URL, credentials, or network issues.

**Solution**:
- Verify WooCommerce REST API is enabled
- Check Consumer Key and Secret are correct
- Ensure URL includes the full path (e.g., `https://store.com`)
- Test API manually:
  ```bash
  curl -u "ck_key:cs_secret" "https://your-store.com/wp-json/wc/v3/system_status"
  ```

#### 3. "Scrape timeout" errors
**Cause**: Large stores with many products/orders.

**Solution**:
- Increase `STORE{N}_TIMEOUT` value
- Adjust `SCRAPE_INTERVAL` to be less frequent
- Consider filtering API requests to recent data

#### 4. High memory usage
**Cause**: Large datasets being processed.

**Solution**:
- Implement data filtering (e.g., last 90 days only)
- Increase container memory limits
- Optimize API queries with pagination

### Debug Mode

Enable debug logging:
```env
LOG_LEVEL=debug
```

View debug logs:
```bash
# Local development
tail -f logs/combined.log

# Docker deployment
docker-compose logs -f woocommerce-exporter
```

### Health Checks

Monitor application health:
```bash
# Quick health check
curl http://localhost:9090/health

# Store-specific connection test
curl -X POST http://localhost:9090/test/store1

# Check Prometheus metrics
curl http://localhost:9090/metrics | grep woocommerce_last_scrape_success
```

## 🤝 Contributing

We love contributions! Please read our [Contributing Guide](CONTRIBUTING.md) and [Code of Conduct](CODE_OF_CONDUCT.md) before submitting PRs.

### Quick Contribution Steps

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
4. **Add tests if applicable**
5. **Commit your changes**
   ```bash
   git commit -m 'Add amazing feature'
   ```
6. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
7. **Open a Pull Request**

### Ways to Contribute

- 🐛 **Report bugs** via [GitHub Issues](https://github.com/webxbeyond/woometrics/issues)
- ✨ **Request features** via [GitHub Discussions](https://github.com/webxbeyond/woometrics/discussions)
- 📖 **Improve documentation**
- 🧪 **Add tests** for better coverage
- 🔧 **Fix bugs** and implement features
- 🌍 **Translate** documentation
- ⭐ **Star the repository** if you find it useful!

### Development Guidelines

- Follow existing code style and patterns
- Add appropriate logging for new features
- Update documentation for new configuration options
- Include error handling for external API calls
- Test with multiple store configurations

### Running Tests

```bash
# Run all tests (with ESM support)
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### ESM Migration Notes

This application now uses ES Modules (ESM) instead of CommonJS:
- All `require()` statements have been converted to `import`
- All `module.exports` have been converted to `export default`
- Package.json includes `"type": "module"`
- File extensions are required in import statements (`.js`)
- `__dirname` and `__filename` are handled via `fileURLToPath()`

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [WooCommerce REST API](https://woocommerce.github.io/woocommerce-rest-api-docs/)
- [Prometheus](https://prometheus.io/)
- [Grafana](https://grafana.com/)
- [Node.js Prometheus Client](https://github.com/siimon/prom-client)

## 📞 Support & Community

- � **Discussions**: [GitHub Discussions](https://github.com/webxbeyond/woometrics/discussions) - Ask questions and share ideas
- 🐛 **Bug Reports**: [GitHub Issues](https://github.com/webxbeyond/woometrics/issues) - Report bugs and request features
- 📖 **Documentation**: [Project Wiki](https://github.com/webxbeyond/woometrics/wiki) - Comprehensive guides and tutorials
- 🔒 **Security**: [Security Policy](SECURITY.md) - Report security vulnerabilities responsibly
- � **Changelog**: [CHANGELOG.md](CHANGELOG.md) - See what's new in each release

### Community Guidelines

Please read our [Code of Conduct](CODE_OF_CONDUCT.md) to understand our community standards and expectations.

## 🏆 Contributors

Thanks to all our amazing contributors! 🎉

<a href="https://github.com/webxbeyond/woometrics/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=webxbeyond/woometrics" />
</a>

## ⭐ Show Your Support

If this project helped you, please consider:
- ⭐ **Starring** the repository
- 🐦 **Sharing** on social media
- 📝 **Writing** a blog post about your experience
- 💝 **Contributing** to the project

## 📈 Project Stats

![GitHub stars](https://img.shields.io/github/stars/webxbeyond/woometrics?style=social)
![GitHub forks](https://img.shields.io/github/forks/webxbeyond/woometrics?style=social)
![GitHub watchers](https://img.shields.io/github/watchers/webxbeyond/woometrics?style=social)

---

**Made with ❤️ by the WooMetrics community for the WooCommerce and DevOps ecosystem**

*"Turning e-commerce data into actionable insights, one metric at a time."*
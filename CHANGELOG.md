# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Initial open source release
- MIT License for open source distribution
- Community contribution guidelines
- Code of conduct for contributors
- Security policy and vulnerability reporting process
- GitHub Actions CI/CD pipeline for automated builds
- Docker Hub integration for container distribution
- Comprehensive documentation for deployment and usage

## [1.0.0] - 2025-10-25

### Added
- Multi-store WooCommerce metrics collection
- Prometheus metrics exporter with 15+ metrics
- Express.js REST API server
- Docker containerization with health checks
- Docker Compose setup with Prometheus and Grafana
- Scheduled metrics collection via node-cron
- Manual collection triggers via REST endpoints
- Comprehensive logging with Winston
- Environment-based configuration
- ES Modules (ESM) support
- Error handling and recovery mechanisms
- Health check endpoints for monitoring
- Support for unlimited WooCommerce stores
- Rate limiting and performance optimizations

### Metrics Included
- `woocommerce_total_orders` - Total orders by status and currency
- `woocommerce_orders_by_status` - Orders grouped by status
- `woocommerce_total_revenue` - Revenue metrics by period
- `woocommerce_revenue_today` - Daily revenue tracking
- `woocommerce_revenue_this_month` - Monthly revenue tracking
- `woocommerce_total_products` - Product count by status
- `woocommerce_low_stock_products` - Low stock alerts
- `woocommerce_out_of_stock_products` - Out of stock tracking
- `woocommerce_total_customers` - Customer count
- `woocommerce_average_order_value` - AOV calculations
- `woocommerce_pending_orders` - Pending order count
- `woocommerce_failed_orders` - Failed order tracking
- `woocommerce_processing_orders` - Processing order count
- `woocommerce_top_products_sold` - Best selling products
- `woocommerce_last_scrape_success` - Scraping success timestamp
- `woocommerce_scrape_errors_total` - Error counter by type

### API Endpoints
- `GET /metrics` - Prometheus metrics endpoint
- `GET /health` - Application health check
- `GET /stores` - List configured stores
- `POST /collect` - Trigger manual collection for all stores
- `POST /collect/:storeId` - Trigger collection for specific store

### Technical Features
- Node.js 18+ with ES Modules
- WooCommerce REST API v3 integration
- Prometheus client for metrics export
- Express.js framework for HTTP server
- Winston logging with file and console output
- Node-cron for scheduled tasks
- Docker multi-stage builds
- Alpine Linux base image for security
- Environment variable configuration
- Graceful shutdown handling
- Connection pooling and retry logic
- Multi-platform Docker builds (AMD64/ARM64)

### Security Features
- Secure credential management via environment variables
- Input validation and sanitization
- Error message sanitization
- Container security best practices
- Non-root container execution
- Regular dependency updates
- Vulnerability scanning in CI/CD

### Documentation
- Comprehensive README with setup instructions
- API documentation with examples
- Docker deployment guide
- Prometheus query examples
- Grafana dashboard templates
- Troubleshooting guide
- Contributing guidelines
- Security policy
- Code of conduct

## [0.1.0] - 2025-10-25

### Added
- Initial project setup
- Basic WooCommerce API integration
- Prometheus metrics collection framework
- Docker development environment
- Core application structure

---

## Release Notes

### Version 1.0.0 - Production Ready

This is the first stable release of WooCommerce Prometheus Exporter, providing:

**🚀 Key Features:**
- Production-ready multi-store WooCommerce monitoring
- Complete Prometheus metrics suite for e-commerce analytics
- Containerized deployment with Docker and Docker Compose
- Automated CI/CD pipeline with GitHub Actions
- Enterprise-grade logging and error handling

**📊 Monitoring Capabilities:**
- Real-time order tracking and revenue analytics
- Inventory management with low stock alerts
- Customer growth metrics
- Product performance analysis
- Store health monitoring

**🔧 Technical Highlights:**
- Modern ES Modules architecture
- Comprehensive test coverage
- Security-first design principles
- Scalable multi-store architecture
- Cloud-native deployment ready

**🐳 Deployment Options:**
- Docker containers with health checks
- Docker Compose for local development
- Kubernetes-ready configuration
- GitHub Container Registry distribution
- Multi-platform builds (AMD64/ARM64)

**📈 What's Next:**
- Grafana dashboard templates
- Additional e-commerce platform support
- Advanced alerting rules
- Performance optimization
- Community-driven enhancements

---

## Breaking Changes

### 1.0.0
- Migrated from CommonJS to ES Modules
- Updated Node.js requirement to 18+
- Changed configuration structure for multi-store support
- Updated Docker base image to Alpine Linux

## Migration Guide

### From 0.x to 1.0.0

1. **Update Node.js**: Ensure you're running Node.js 18 or higher
2. **Update imports**: Change from `require()` to `import` statements
3. **Update configuration**: Use new multi-store environment variables
4. **Update Docker**: Use new Alpine-based images
5. **Test thoroughly**: Verify all metrics are collecting correctly

## Support

- **Documentation**: Check the README and docs/ directory
- **Issues**: Report bugs via GitHub Issues
- **Discussions**: Join GitHub Discussions for questions
- **Security**: Report vulnerabilities to security@woometrics.dev

## Contributors

Thanks to all contributors who helped make this project possible! 🎉

---

*For more information, visit the [GitHub repository](https://github.com/your-org/woometrics).*
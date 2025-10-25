# Contributing to WooCommerce Prometheus Exporter

First off, thank you for considering contributing to this project! 🎉

## Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the existing issues to avoid duplicates. When you create a bug report, please include as many details as possible:

* **Use a clear and descriptive title**
* **Describe the exact steps to reproduce the problem**
* **Provide specific examples to demonstrate the steps**
* **Describe the behavior you observed after following the steps**
* **Explain which behavior you expected to see instead and why**
* **Include screenshots if applicable**
* **Include your environment details** (OS, Node.js version, WooCommerce version)

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, please include:

* **Use a clear and descriptive title**
* **Provide a step-by-step description of the suggested enhancement**
* **Provide specific examples to demonstrate the steps**
* **Describe the current behavior and explain which behavior you expected**
* **Explain why this enhancement would be useful**

### Pull Requests

1. Fork the repo and create your branch from `main`
2. If you've added code that should be tested, add tests
3. If you've changed APIs, update the documentation
4. Ensure the test suite passes
5. Make sure your code lints
6. Issue that pull request!

## Development Process

### Setting Up Development Environment

```bash
# Clone your fork
git clone https://github.com/webxbeyond/woometrics.git
cd woometrics

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Edit .env with your WooCommerce store credentials
# Start development server
npm run dev
```

### Project Structure

```
src/
├── app.js              # Main application entry point
├── config/
│   └── stores.config.js # Store configuration
├── services/
│   ├── woocommerce-client.js  # WooCommerce API client
│   └── metrics-collector.js   # Prometheus metrics collector
└── utils/
    └── logger.js       # Winston logger configuration
```

### Coding Standards

* Use ES6+ features and ES Modules
* Follow the existing code style
* Add JSDoc comments for public methods
* Use meaningful variable and function names
* Keep functions small and focused
* Add error handling for all async operations

### Adding New Metrics

When adding new metrics, follow this pattern:

1. Define the metric in `MetricsCollector` constructor
2. Add collection logic in appropriate collect method
3. Update README documentation
4. Add tests for the new metric

Example:
```javascript
// In constructor
this.newMetric = new client.Gauge({
    name: 'woocommerce_new_metric',
    help: 'Description of what this measures',
    labelNames: ['store_id', 'store_name', 'additional_label'],
    registers: [this.register]
});

// In collection method
this.newMetric.set(
    { store_id: storeId, store_name: storeName, additional_label: value },
    metricValue
);
```

### Testing

* Write unit tests for new features
* Ensure all tests pass before submitting PR
* Add integration tests for new API endpoints
* Test with multiple WooCommerce store configurations

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run linting
npm run lint
```

### Adding New Store Support

When adding support for new e-commerce platforms:

1. Create a new client in `src/services/`
2. Implement the same interface as `WooCommerceClient`
3. Update store configuration to support the new platform
4. Add platform-specific metrics if needed
5. Update documentation

## Commit Messages

* Use the present tense ("Add feature" not "Added feature")
* Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
* Limit the first line to 72 characters or less
* Reference issues and pull requests liberally after the first line

Examples:
```
Add support for product variation metrics

Closes #123

- Add new metrics for product variations
- Update tests for variation tracking
- Add documentation for new metrics
```

## Release Process

1. Update version in `package.json`
2. Update `CHANGELOG.md`
3. Create release notes
4. Tag the release
5. GitHub Actions will automatically build and publish Docker images

## Community

* Join our discussions in GitHub Discussions
* Follow us on social media for updates
* Star the repository if you find it useful

## Recognition

Contributors will be recognized in:
* README.md contributors section
* Release notes
* Annual contributor appreciation posts

## Questions?

Feel free to open an issue with the "question" label or start a discussion in GitHub Discussions.

Thank you for contributing! 🚀
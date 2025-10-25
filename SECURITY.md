# Security Policy

## Supported Versions

We actively support the following versions of this project:

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

We take the security of WooCommerce Prometheus Exporter seriously. If you believe you have found a security vulnerability, please report it to us responsibly.

### How to Report

**Please do NOT report security vulnerabilities through public GitHub issues.**

Instead, please send an email to security@woometrics.dev with:

1. **Subject Line**: "Security Vulnerability Report - [Brief Description]"
2. **Description**: A clear description of the vulnerability
3. **Impact**: What could an attacker accomplish?
4. **Reproduction**: Step-by-step instructions to reproduce the issue
5. **Environment**: Affected versions, configurations, etc.
6. **Contact**: Your contact information for follow-up questions

### What to Expect

- **Acknowledgment**: We'll acknowledge receipt of your report within 24 hours
- **Initial Response**: We'll provide an initial response within 72 hours
- **Updates**: We'll keep you informed of our progress
- **Resolution**: We aim to resolve critical vulnerabilities within 7 days
- **Disclosure**: We'll coordinate with you on responsible disclosure

### Security Best Practices

When deploying this application:

#### Environment Security
- **Never commit `.env` files** with real credentials to version control
- **Use strong, unique API keys** for each WooCommerce store
- **Rotate API keys regularly** (recommended: every 90 days)
- **Use HTTPS only** for WooCommerce store connections
- **Limit API key permissions** to minimum required scopes

#### Network Security
- **Use reverse proxy** (nginx/Apache) in production
- **Enable rate limiting** on all endpoints
- **Implement IP whitelisting** for administrative endpoints
- **Use TLS/SSL certificates** for all communications
- **Isolate network access** using Docker networks or VPNs

#### Container Security
- **Run as non-root user** in containers
- **Use specific image tags** instead of `latest`
- **Scan images for vulnerabilities** using tools like Trivy
- **Keep base images updated** regularly
- **Use multi-stage builds** to minimize attack surface

#### Monitoring & Logging
- **Enable audit logging** for all API access
- **Monitor for unusual patterns** in API usage
- **Set up alerts** for failed authentication attempts
- **Log security events** to external systems
- **Implement log rotation** to prevent disk exhaustion

#### API Security
- **Validate all inputs** to prevent injection attacks
- **Sanitize error messages** to prevent information disclosure
- **Implement request timeouts** to prevent DoS attacks
- **Use API versioning** for backward compatibility
- **Document security requirements** for integrations

### Common Vulnerabilities to Check

When contributing or reviewing code, please be aware of:

1. **Injection Attacks**
   - SQL injection in database queries
   - Command injection in system calls
   - Log injection in logging statements

2. **Authentication & Authorization**
   - Weak or missing API key validation
   - Insufficient access controls
   - Session management issues

3. **Data Exposure**
   - Sensitive data in logs
   - API keys in error messages
   - Information disclosure in stack traces

4. **Denial of Service**
   - Resource exhaustion attacks
   - Uncontrolled resource consumption
   - Memory leaks in long-running processes

5. **Dependencies**
   - Known vulnerabilities in npm packages
   - Outdated dependencies with security issues
   - Supply chain attacks through compromised packages

### Security Testing

We encourage security testing but please:

- **Test only your own instances** - never test against others' systems
- **Follow responsible disclosure** if you find issues
- **Don't perform destructive tests** that could affect availability
- **Respect rate limits** and don't overwhelm services
- **Document your findings** clearly and thoroughly

### Automated Security Measures

This project includes:

- **Dependabot alerts** for vulnerable dependencies
- **CodeQL analysis** for code security scanning
- **Container vulnerability scanning** with Trivy
- **Automated security updates** for non-breaking changes
- **Security-focused CI/CD pipeline** with multiple checkpoints

### Security Updates

Security updates will be:

- **Released immediately** for critical vulnerabilities
- **Communicated** through GitHub Security Advisories
- **Documented** in release notes with CVE references
- **Backported** to supported versions when possible
- **Tested thoroughly** before release

### Hall of Fame

We recognize security researchers who help improve our security:

- [Your name could be here] - Responsible disclosure of [vulnerability type]

*Note: Recognition is subject to the severity and quality of the report, and the researcher's preference for attribution.*

### Contact Information

- **Security Email**: security@woometrics.dev
- **General Contact**: hello@woometrics.dev
- **GitHub Security**: Use GitHub's private vulnerability reporting feature

### Legal

This security policy is provided "as is" without warranty of any kind. By reporting vulnerabilities, you agree to:

- Give us reasonable time to address the issue before public disclosure
- Not access or modify data that doesn't belong to you
- Act in good faith and avoid privacy violations or service disruptions
- Comply with applicable laws and regulations

Thank you for helping keep WooCommerce Prometheus Exporter secure! 🔒
name: Pull Request
description: Create a pull request to contribute to this project
title: "[PR]: "
labels: ["pr", "review-needed"]
assignees: []
body:
  - type: markdown
    attributes:
      value: |
        Thanks for contributing! 🎉
        
        Please make sure you've read our [Contributing Guide](https://github.com/your-org/woometrics/blob/main/CONTRIBUTING.md) before submitting.
  
  - type: input
    id: contact
    attributes:
      label: Contact Details
      description: How can we get in touch with you if we need more info?
      placeholder: ex. email@example.com
    validations:
      required: false
  
  - type: textarea
    id: description
    attributes:
      label: Description
      description: Please provide a clear description of what this PR does
      placeholder: This PR adds/fixes/improves...
    validations:
      required: true
  
  - type: dropdown
    id: type
    attributes:
      label: Type of Change
      description: What type of change is this?
      options:
        - Bug fix (non-breaking change which fixes an issue)
        - New feature (non-breaking change which adds functionality)
        - Breaking change (fix or feature that would cause existing functionality to not work as expected)
        - Documentation update
        - Performance improvement
        - Code refactoring
        - CI/CD improvement
        - Security improvement
        - Other
    validations:
      required: true
  
  - type: textarea
    id: related-issues
    attributes:
      label: Related Issues
      description: Please link any related issues
      placeholder: |
        Fixes #123
        Closes #456
        Related to #789
    validations:
      required: false
  
  - type: textarea
    id: changes
    attributes:
      label: Changes Made
      description: Please describe the changes made in detail
      placeholder: |
        - Added new metric for cart abandonment rate
        - Updated WooCommerce client to handle rate limiting
        - Fixed memory leak in metrics collector
        - Added tests for new functionality
    validations:
      required: true
  
  - type: textarea
    id: testing
    attributes:
      label: Testing
      description: Please describe how you tested these changes
      placeholder: |
        - Unit tests added/updated
        - Integration tests passed
        - Manual testing performed
        - Tested with WooCommerce versions X.Y.Z
        - Tested in Docker environment
    validations:
      required: true
  
  - type: textarea
    id: breaking-changes
    attributes:
      label: Breaking Changes
      description: If this is a breaking change, please describe what breaks and how to migrate
      placeholder: |
        This change breaks...
        To migrate, users need to...
        Configuration changes required...
    validations:
      required: false
  
  - type: textarea
    id: documentation
    attributes:
      label: Documentation
      description: Have you updated relevant documentation?
      placeholder: |
        - Updated README.md
        - Added API documentation
        - Updated CHANGELOG.md
        - Added code comments
    validations:
      required: false
  
  - type: checkboxes
    id: checklist
    attributes:
      label: Checklist
      description: Please check all items that apply
      options:
        - label: My code follows the style guidelines of this project
          required: true
        - label: I have performed a self-review of my own code
          required: true
        - label: I have commented my code, particularly in hard-to-understand areas
          required: false
        - label: I have made corresponding changes to the documentation
          required: false
        - label: My changes generate no new warnings
          required: true
        - label: I have added tests that prove my fix is effective or that my feature works
          required: false
        - label: New and existing unit tests pass locally with my changes
          required: true
        - label: Any dependent changes have been merged and published in downstream modules
          required: false
  
  - type: checkboxes
    id: testing-checklist
    attributes:
      label: Testing Checklist
      description: Please check all testing that was performed
      options:
        - label: Unit tests pass
          required: false
        - label: Integration tests pass
          required: false
        - label: Manual testing performed
          required: false
        - label: Tested with multiple WooCommerce stores
          required: false
        - label: Tested Docker deployment
          required: false
        - label: Tested metrics collection accuracy
          required: false
        - label: Tested error handling scenarios
          required: false
  
  - type: textarea
    id: screenshots
    attributes:
      label: Screenshots (if applicable)
      description: Add screenshots to help explain your changes
      placeholder: |
        Before/after screenshots, new UI elements, etc.
    validations:
      required: false
  
  - type: textarea
    id: additional-notes
    attributes:
      label: Additional Notes
      description: Any additional information about this PR
      placeholder: |
        Performance considerations, known limitations, future improvements, etc.
    validations:
      required: false
  
  - type: checkboxes
    id: final-checklist
    attributes:
      label: Final Checklist
      description: Final checks before submitting
      options:
        - label: I have read the [Contributing Guide](https://github.com/your-org/woometrics/blob/main/CONTRIBUTING.md)
          required: true
        - label: I agree to follow this project's [Code of Conduct](https://github.com/your-org/woometrics/blob/main/CODE_OF_CONDUCT.md)
          required: true
        - label: I understand that this PR may be closed if it doesn't meet the project's standards
          required: true
---
name: Code Review Standards
description: Guidelines for performing code reviews and ensuring code quality.
---

# Code Review Process

When asked to review code, follow these steps:

1.  **Analyze Structure**: Check if the code follows the project's architectural patterns.
2.  **Verify Safety**: Look for potential security vulnerabilities (e.g., SQL injection, XSS).
3.  **Check Error Handling**: Ensure all asynchronous operations have try-catch blocks or equivalent error handling.
4.  **Validate Styling**: Confirm that CSS/Tailwind classes match the design system.

## Checklist

- [ ] No hardcoded secrets
- [ ] Variable names are descriptive
- [ ] Functions are small and focused
- [ ] Comments explain "why", not "what"

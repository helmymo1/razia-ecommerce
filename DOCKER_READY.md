# Docker Deployment - Pre-Flight Checklist

## Required GitHub Repository Secrets

Before the CI/CD pipeline can deploy your application, add these **3 secrets** to your GitHub repository:

**Settings → Secrets and variables → Actions → New repository secret**

| Secret Name | Value | Description |
|-------------|-------|-------------|
| `SSH_PRIVATE_KEY` | Your private key content | SSH key for VPS access (begins with `-----BEGIN OPENSSH PRIVATE KEY-----`) |
| `HOST` | `72.62.237.1` | Hostinger VPS IP address |
| `USERNAME` | `root` (or your VPS user) | SSH username for VPS |

---

## VPS Prerequisites

Ensure your Hostinger VPS has:

- [x] Docker installed (`docker --version`)
- [x] Docker Compose installed (`docker compose version`)
- [x] SSH access enabled
- [x] Public key added to `~/.ssh/authorized_keys`

---

## Workflow Permissions

In GitHub repository settings:

**Settings → Actions → General → Workflow permissions**

- [x] Enable **Read and write permissions**
- [x] Allow GitHub Actions to push packages to GHCR

---

## Trigger Deployment

Once secrets are configured, push to `main` branch:

```bash
git add .
git commit -m "chore: trigger deployment"
git push origin main
```

Monitor the workflow at: `https://github.com/<your-repo>/actions`

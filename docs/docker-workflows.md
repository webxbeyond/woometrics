# GitHub Actions Docker Workflows

This repository includes GitHub Actions workflows to automatically build and push Docker images for the WooMetrics application.

## 🔧 Available Workflows

### 1. `docker-build.yml` - GitHub Container Registry (Recommended)
- **Triggers:** Push to `main`/`develop`, tags, and pull requests
- **Registry:** GitHub Container Registry (ghcr.io)
- **Features:**
  - Multi-platform builds (AMD64 + ARM64)
  - Automated testing with Node.js 18.x and 20.x
  - Security scanning with Trivy
  - Automatic deployment to staging/production
  - Build caching for faster builds

### 2. `docker-hub.yml` - Docker Hub (Optional)
- **Triggers:** Push to `main` and version tags
- **Registry:** Docker Hub
- **Features:**
  - Multi-platform builds
  - Automatic README sync to Docker Hub

## 🚀 Setup Instructions

### For GitHub Container Registry (ghcr.io)

**No additional setup required!** The workflow uses `GITHUB_TOKEN` which is automatically available.

The images will be available at:
```
ghcr.io/webxbeyond/woometrics:latest
ghcr.io/webxbeyond/woometrics:main
ghcr.io/webxbeyond/woometrics:v1.0.0
```

### For Docker Hub

1. **Create Docker Hub account** at https://hub.docker.com
2. **Create access token:**
   - Go to Account Settings → Security → Access Tokens
   - Click "New Access Token"
   - Name: `GitHub Actions`
   - Permissions: `Read, Write, Delete`
   - Copy the token

3. **Add GitHub Secrets:**
   - Go to your repository → Settings → Secrets and variables → Actions
   - Add these secrets:
     - `DOCKERHUB_USERNAME`: Your Docker Hub username
     - `DOCKERHUB_TOKEN`: Your Docker Hub access token

## 📦 Image Tagging Strategy

### Automatic Tags Created:
- `latest` - Latest main branch build
- `main` - Main branch builds
- `develop` - Develop branch builds  
- `pr-123` - Pull request builds
- `v1.0.0` - Version tags (semantic versioning)
- `v1.0` - Minor version tags
- `v1` - Major version tags

### Usage Examples:
```bash
# Latest stable version
docker pull ghcr.io/webxbeyond/woometrics:latest

# Specific version
docker pull ghcr.io/webxbeyond/woometrics:v1.0.0

# Development version
docker pull ghcr.io/webxbeyond/woometrics:develop
```

## 🔄 Workflow Triggers

### Automatic Triggers:
- **Push to main:** Builds and tags as `latest`
- **Push to develop:** Builds and tags as `develop`
- **Create tag `v*`:** Builds release versions
- **Pull requests:** Builds for testing (not pushed)

### Manual Triggers:
You can manually trigger workflows from the Actions tab in your repository.

## 🏗️ Build Process

### 1. Test Stage
- Runs on Node.js 18.x and 20.x
- Installs dependencies
- Runs tests (if available)
- Syntax validation for all source files

### 2. Build Stage
- Sets up Docker Buildx for multi-platform builds
- Builds for `linux/amd64` and `linux/arm64`
- Uses build cache for faster subsequent builds
- Pushes to container registry

### 3. Security Stage
- Scans built image with Trivy for vulnerabilities
- Uploads results to GitHub Security tab
- Fails build if critical vulnerabilities found

### 4. Deploy Stage (Optional)
- **Staging:** Auto-deploys `develop` branch
- **Production:** Auto-deploys version tags
- Requires environment setup in repository settings

## 🐳 Using the Built Images

### With Docker:
```bash
# Pull and run latest image
docker run -d \
  --name woometrics \
  -p 9090:9090 \
  --env-file .env \
  ghcr.io/webxbeyond/woometrics:latest
```

### With Docker Compose:
```yaml
# Update your docker-compose.yml
services:
  woometrics:
    image: ghcr.io/webxbeyond/woometrics:latest
    # ... rest of your configuration
```

### With Kubernetes:
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: woometrics
spec:
  replicas: 1
  selector:
    matchLabels:
      app: woometrics
  template:
    metadata:
      labels:
        app: woometrics
    spec:
      containers:
      - name: woometrics
        image: ghcr.io/webxbeyond/woometrics:latest
        ports:
        - containerPort: 9090
```

## 🔒 Security Features

### Image Scanning
- **Trivy scanner** checks for vulnerabilities
- Results uploaded to GitHub Security tab
- Build fails on critical vulnerabilities

### Multi-platform Support
- Builds for AMD64 (Intel/AMD) and ARM64 (Apple Silicon, ARM servers)
- Ensures compatibility across different architectures

### Minimal Attack Surface
- Uses `.dockerignore` to exclude unnecessary files
- Node.js 18 Alpine base image
- Non-root user execution

## 📊 Monitoring Build Status

### GitHub Actions Tab
- View build logs and status
- Download build artifacts
- Monitor deployment status

### Repository Badges
Add these badges to your README.md:

```markdown
![Docker Build](https://github.com/webxbeyond/woometrics/actions/workflows/docker-build.yml/badge.svg)
![Docker Pulls](https://img.shields.io/docker/pulls/webxbeyond/woometrics)
![Image Size](https://img.shields.io/docker/image-size/webxbeyond/woometrics)
```

## 🛠️ Customization

### Environment-specific Images
To build images for specific environments, you can:

1. **Create environment branches:**
   ```bash
   git checkout -b staging
   git checkout -b production
   ```

2. **Modify workflow triggers:**
   ```yaml
   on:
     push:
       branches: [main, staging, production]
   ```

3. **Use build args:**
   ```yaml
   - name: Build and push Docker image
     uses: docker/build-push-action@v5
     with:
       build-args: |
         NODE_ENV=production
         BUILD_VERSION=${{ github.sha }}
   ```

### Custom Deployment
Replace the deploy steps with your deployment method:

- **Kubernetes:** `kubectl apply -f k8s/`
- **Docker Swarm:** `docker stack deploy -c docker-compose.yml woometrics`
- **Cloud Run:** `gcloud run deploy woometrics --image=ghcr.io/...`
- **AWS ECS:** Update service with new image
- **Webhook:** Trigger deployment webhook

## 🔧 Troubleshooting

### Common Issues:

1. **Build fails on dependencies:**
   ```bash
   # Clear npm cache in workflow
   - run: npm cache clean --force
   ```

2. **Multi-platform build issues:**
   ```bash
   # Use specific platform for testing
   docker pull --platform linux/amd64 ghcr.io/webxbeyond/woometrics
   ```

3. **Permission denied:**
   - Check repository settings → Actions → General
   - Ensure "Read and write permissions" is enabled

4. **Registry authentication:**
   - For GHCR: Ensure `packages: write` permission
   - For Docker Hub: Verify secrets are correctly set

### Debug Build Issues:
```bash
# Build locally to debug
docker build -t woometrics-debug .

# Check build context
docker build --no-cache -t woometrics-debug .
```

## 📚 Additional Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Docker Build Push Action](https://github.com/docker/build-push-action)
- [GitHub Container Registry](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry)
- [Docker Hub](https://docs.docker.com/docker-hub/)

---

🎉 **Your WooMetrics application is now ready for automated Docker builds and deployments!**
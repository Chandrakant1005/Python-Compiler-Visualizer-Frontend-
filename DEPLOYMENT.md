# Frontend Deployment Guide

## Environment Setup

### 1. Environment Variables
Copy `.env.example` to `.env` and configure your backend URL:

```bash
cp .env.example .env
```

Update `.env` with your backend URL:
```bash
# For local development
REACT_APP_BACKEND_URL=http://localhost:8000

# For production (example)
REACT_APP_BACKEND_URL=https://your-backend.onrender.com
```

## Installation & Development

### Clean Install (Recommended for CI/CD)
```bash
npm ci
```

### Fresh Install
```bash
npm run fresh
```

### Development
```bash
npm start
```

## Production Build

### Standard Build
```bash
npm run build
```

### Production Build with Environment Variable
```bash
REACT_APP_BACKEND_URL=https://your-backend-url.com npm run build:prod
```

### Serve Production Build
```bash
npm run serve
```

## CI/CD Pipeline Example

### GitHub Actions
```yaml
name: Deploy Frontend
on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build for production
        run: REACT_APP_BACKEND_URL=${{ secrets.BACKEND_URL }} npm run build
      
      - name: Deploy to hosting
        # Your deployment steps here
```

### Dockerfile Example
```dockerfile
# Build stage
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
ARG REACT_APP_BACKEND_URL
ENV REACT_APP_BACKEND_URL=$REACT_APP_BACKEND_URL
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## Platform-Specific Deployment

### Vercel
1. Connect your repository
2. Set environment variable in Vercel dashboard:
   - `REACT_APP_BACKEND_URL`: Your backend URL
3. Deploy automatically

### Netlify
1. Connect your repository
2. Set environment variable:
   - `REACT_APP_BACKEND_URL`: Your backend URL
3. Build command: `npm run build`
4. Publish directory: `build`

### Render
1. Connect your repository
2. Set environment variable:
   - `REACT_APP_BACKEND_URL`: Your backend URL
3. Build command: `npm run build`
4. Start command: `npm run serve`

### AWS S3 + CloudFront
```bash
# Build and deploy
npm run build
aws s3 sync build/ s3://your-bucket-name --delete
```

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `REACT_APP_BACKEND_URL` | Backend API URL | `https://api.yourdomain.com` |

## Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure backend allows your frontend domain
2. **Environment Variables**: Make sure they start with `REACT_APP_`
3. **Build Failures**: Check `package-lock.json` is in sync with `package.json`

### Debug Commands

```bash
# Check environment variables
npm run start | grep REACT_APP

# Clean everything and start fresh
npm run fresh

# Check for security vulnerabilities
npm audit
```

## Performance Optimization

### Build Optimization
```bash
# Analyze bundle size
npm run build && npx bundle-analyzer build/static/js/*.js

# Source maps for debugging
GENERATE_SOURCEMAP=true npm run build
```

### Cache Busting
The build automatically adds hash-based filenames for cache busting.

## Security Notes

- Never commit `.env` files to version control
- Use HTTPS in production for backend URLs
- Regularly update dependencies: `npm update`
- Check for vulnerabilities: `npm audit fix`

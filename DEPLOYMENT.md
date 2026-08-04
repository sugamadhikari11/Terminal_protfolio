# Terminal Portfolio Deployment Guide

This guide explains CI/CD deployment for the Next.js Terminal Portfolio to a Microsoft Azure Ubuntu VM.

## Stack

- **Next.js 15** (App Router) with `output: "standalone"`
- Nginx reverse-proxies to the Node server on port **3000**
- PM2 keeps the app running
- API routes live under `src/app/api/` (example: `/api/health`)

## Prerequisites

- GitHub repository with this project
- Microsoft Azure Ubuntu VM with SSH access
- GitHub secrets: `AZURE_VM_HOST`, `AZURE_VM_USERNAME`, `AZURE_VM_SSH_KEY`

## Local development

```bash
nvm use          # Node 24 via .nvmrc
npm install
npm run dev      # http://localhost:8080
```

## Production commands

```bash
npm run build
npm start        # http://localhost:3000
```

## Deploy

Push to `master`. GitHub Actions builds the Next.js standalone bundle, uploads it to the VM, configures Nginx as a reverse proxy, and restarts the app with PM2.

## Manual smoke checks

- Site: `http://YOUR_VM_IP`
- Health API: `http://YOUR_VM_IP/api/health`

# Terminal Portfolio Deployment Guide

This guide explains how to set up CI/CD deployment for your Terminal Portfolio project to a Microsoft Azure Ubuntu VM.

## Prerequisites

- GitHub repository with this project
- Microsoft Azure account
- Ubuntu VM with Nginx installed on Azure

## Setup Process

### 1. Set up your Azure VM

1. Create an Ubuntu VM in Azure
2. Ensure you have SSH access to the VM
3. Run the setup script from this repository:

```bash
# Copy the script to your VM
scp scripts/azure-vm-setup.sh user@your-vm-ip:~/

# SSH into your VM
ssh user@your-vm-ip

# Run the setup script
sudo bash azure-vm-setup.sh
```

### 2. Configure GitHub Secrets

Add the following secrets to your GitHub repository:

- `AZURE_VM_HOST`: The IP address or domain name of your Azure VM
- `AZURE_VM_USERNAME`: The SSH username for your Azure VM
- `AZURE_VM_SSH_KEY`: Your private SSH key for accessing the VM

### 3. Push to GitHub

The CI/CD pipeline will automatically:

1. Build your React application
2. Create a Docker image
3. Push the image to GitHub Container Registry
4. Deploy the image to your Azure VM

## Manual Deployment

If you need to deploy manually, SSH into your VM and run:

```bash
# Pull the latest image
docker pull ghcr.io/your-username/your-repo:latest

# Stop and remove the existing container
docker stop terminal-portfolio
docker rm terminal-portfolio

# Run the new container
docker run -d --restart always -p 80:80 --name terminal-portfolio ghcr.io/your-username/your-repo:latest
```

## Troubleshooting

If you encounter issues:

1. Check GitHub Actions logs for build/deployment errors
2. Verify your VM can access GitHub Container Registry
3. Ensure Docker is running on your VM
4. Check Nginx configuration if serving through an Nginx proxy

## HTTPS Setup (Optional)

To enable HTTPS:

1. Obtain SSL certificates (Let's Encrypt recommended)
2. Update the Nginx configuration to use SSL
3. Open port 443 on your Azure VM

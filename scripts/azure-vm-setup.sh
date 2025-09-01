#!/bin/bash
# Azure VM setup script for Terminal Portfolio deployment
# This script prepares an Ubuntu VM for running the terminal portfolio in Docker

# Ensure script is run as root
if [ "$(id -u)" -ne 0 ]; then
    echo "This script must be run as root. Please use sudo."
    exit 1
fi

# Update system packages
echo "Updating system packages..."
apt-get update
apt-get upgrade -y

# Install Docker if not already installed
if ! command -v docker &> /dev/null; then
    echo "Installing Docker..."
    apt-get install -y apt-transport-https ca-certificates curl software-properties-common
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | apt-key add -
    add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"
    apt-get update
    apt-get install -y docker-ce docker-ce-cli containerd.io
    systemctl enable docker
    systemctl start docker
else
    echo "Docker is already installed."
fi

# Configure firewall to allow HTTP/HTTPS traffic
echo "Configuring firewall..."
apt-get install -y ufw
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw --force enable

# Create directory for SSL certificates (if you plan to use HTTPS)
mkdir -p /etc/ssl/terminal-portfolio

echo "===================================="
echo "Server setup complete!"
echo "Now you need to set up GitHub secrets for CI/CD deployment:"
echo "1. AZURE_VM_HOST: Your VM's public IP or domain"
echo "2. AZURE_VM_USERNAME: SSH username"
echo "3. AZURE_VM_SSH_KEY: Your private SSH key"
echo "===================================="

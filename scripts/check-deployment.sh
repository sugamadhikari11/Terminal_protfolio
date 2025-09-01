#!/bin/bash
# Deployment status checker script
# Run this on your Azure VM to check the status of your deployment

echo "==== Terminal Portfolio Deployment Status ===="
echo

# Check if Docker is running
if systemctl is-active --quiet docker; then
  echo "✅ Docker service is running"
else
  echo "❌ Docker service is NOT running"
  echo "   Try running: sudo systemctl start docker"
fi

# Check if the container is running
if docker ps | grep -q terminal-portfolio; then
  echo "✅ Terminal Portfolio container is running"
  
  # Get container details
  CONTAINER_ID=$(docker ps -f name=terminal-portfolio -q)
  IMAGE=$(docker inspect --format='{{.Config.Image}}' $CONTAINER_ID)
  CREATED=$(docker inspect --format='{{.Created}}' $CONTAINER_ID)
  PORTS=$(docker inspect --format='{{.NetworkSettings.Ports}}' $CONTAINER_ID)
  
  echo "   Container ID: $CONTAINER_ID"
  echo "   Image: $IMAGE"
  echo "   Created: $CREATED"
  echo "   Port mapping: $PORTS"
else
  echo "❌ Terminal Portfolio container is NOT running"
  
  # Check if it exists but is stopped
  if docker ps -a | grep -q terminal-portfolio; then
    echo "   Container exists but is stopped. Check logs with: docker logs terminal-portfolio"
    echo "   Start container with: docker start terminal-portfolio"
  else
    echo "   Container does not exist. Deploy may have failed."
  fi
fi

# Check if nginx is running (if using as a reverse proxy)
if systemctl is-active --quiet nginx; then
  echo "✅ Nginx service is running"
else
  echo "❌ Nginx service is NOT running"
  echo "   Try running: sudo systemctl start nginx"
fi

# Check if port 80 is open
if netstat -tuln | grep -q ":80 "; then
  echo "✅ Port 80 is open and listening"
else
  echo "❌ Port 80 is NOT open"
  echo "   Check container port mapping or nginx configuration"
fi

echo
echo "==== End of Status Report ===="

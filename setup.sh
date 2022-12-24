#!/bin/bash

# Install the required packages
apt-get update
apt-get install hostapd dnsmasq nginx

# Create the hostapd configuration file if it does not already exist
if [ ! -f /etc/hostapd/hostapd.conf ]
then
  cat <<EOF >/etc/hostapd/hostapd.conf
interface=wlan0
driver=nl80211
ssid=PiTank
hw_mode=g
channel=6
wpa=0
EOF
fi

# Create the dnsmasq configuration file if it does not already exist
if [ ! -f /etc/dnsmasq.conf ]
then
  cat <<EOF >/etc/dnsmasq.conf
interface=wlan0
dhcp-range=192.168.4.2,192.168.4.20,255.255.255.0,12h
dhcp-option=3,192.168.4.1
dhcp-option=6,192.168.4.1
server=8.8.8.8
log-queries
log-dhcp
listen-address=127.0.0.1
EOF
fi

# Create the bridge interface
brctl addbr br0
brctl addif br0 eth0 wlan0

# Configure the /etc/network/interfaces file to use the bridge interface
cat <<EOF >/etc/network/interfaces
# The loopback network interface
auto lo
iface lo inet loopback

# The primary network interface
auto br0
iface br0 inet dhcp
  bridge_ports eth0 wlan0
EOF

# Configure the nginx server to serve the index.html file
cat <<EOF >/etc/nginx/sites-enabled/default
server {
  listen 80;
  root $(pwd);
  index index.html;
}
EOF

# Restart the networking and nginx services
systemctl restart networking
systemctl restart nginx

# Run the node file
cd $(pwd)
npm install

# Add the script to the cron tasks to run on startup
crontab -l > mycron
echo "@reboot $(pwd)/setup.sh" >> mycron

# Continuously run the piTank.js script
while true
do
  sudo node pitank.js
done
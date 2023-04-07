#!/bin/bash

# Prompt the user for their preferred Wi-Fi network details
read -p "Enter the name of the Wi-Fi network you want to create: " wifi_ssid
read -s -p "Enter a password for the Wi-Fi network: " wifi_password
echo ""
read -p "Enter your home Wi-Fi network's SSID: " home_ssid
read -s -p "Enter your home Wi-Fi network's password: " home_password
echo ""

# Install necessary packages
sudo apt update
sudo apt install hostapd dnsmasq

# Stop the hostapd and networking services
sudo systemctl stop hostapd
sudo systemctl stop networking

# Configure the Wi-Fi access point (AP)
sudo tee /etc/hostapd/hostapd.conf > /dev/null <<EOF
interface=wlan1
ssid=$wifi_ssid
hw_mode=g
channel=6
macaddr_acl=0
auth_algs=1
ignore_broadcast_ssid=0
wpa=2
wpa_passphrase=$wifi_password
wpa_key_mgmt=WPA-PSK
wpa_pairwise=TKIP
rsn_pairwise=CCMP
EOF

# Configure the Wi-Fi client
sudo tee /etc/wpa_supplicant/wpa_supplicant.conf > /dev/null <<EOF
ctrl_interface=DIR=/var/run/wpa_supplicant GROUP=netdev
update_config=1

network={
    ssid="$home_ssid"
    psk="$home_password"
}
EOF

# Modify the dhcpcd configuration file
sudo tee -a /etc/dhcpcd.conf > /dev/null <<EOF
interface wlan1
    static ip_address=192.168.4.1/24
    nohook wpa_supplicant
EOF

# Configure the DNS server
sudo sed -i 's/^#interface=interface/interface=wlan1/' /etc/dnsmasq.conf
sudo sed -i 's/^#dhcp-range/dhcp-range/' /etc/dnsmasq.conf
sudo sed -i 's/^#domain-needed/domain-needed/' /etc/dnsmasq.conf
sudo sed -i 's/^#bogus-priv/bogus-priv/' /etc/dnsmasq.conf

# Restart the hostapd, dnsmasq, and networking services
sudo systemctl restart hostapd
sudo systemctl restart dnsmasq
sudo systemctl restart networking

echo "Wi-Fi network setup complete. The Raspberry Pi should now be broadcasting the \"$wifi_ssid\" network while also connected to your home Wi-Fi network \"$home_ssid\"."

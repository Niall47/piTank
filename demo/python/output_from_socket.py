import socket
import json


def client():
    print('Connecting to server')
    host = '192.168.0.47'
    port = 5000
    client_socket = socket.socket()
    client_socket.connect((host, port))


    while True:
        data = client_socket.recv(1024).decode()
        print(data)

if __name__ == '__main__':
    client()


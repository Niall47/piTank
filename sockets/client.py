
import socket

def client():
    host = socket.gethostname()
    port = 5000

    client_socket = socket.socket()
    client_socket.connect((host, port))

    while True:
        data = client_socket.recv(1024).decode()
        print(data)

if __name__ == '__main__':
    client()

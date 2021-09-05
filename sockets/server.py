import socket
import time
import pyxhook
import os


def send_inputs():
    global connection

    new_hook = pyxhook.HookManager()
    new_hook.KeyDown = OnKeyPress
    new_hook.KeyUp = OnKeyRelease
    host = socket.gethostname()
    port = 5000
    server_socket = socket.socket()
    server_socket.bind((host, port))
    server_socket.listen(2)

    while True:
        conn, address = server_socket.accept()
        connection = conn
        print("Connection from: " + str(address))
        new_hook.HookKeyboard()
        try:
            new_hook.start()
        except KeyboardInterrupt:
            # User cancelled
            pass
        except Exception as ex:
            print(ex)
        # conn.send('helloworld'.encode())  # send data to the client

    # conn.close()  # close the connection
def OnKeyPress(event):
    input = '{}\n'.format(event.Key)
    connection.send(input.encode())

def OnKeyRelease(event):
    connection.send('-'.encode())

if __name__ == '__main__':
    connection = ''
    send_inputs()

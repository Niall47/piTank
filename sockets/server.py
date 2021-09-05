from re import A
import socket
import time
import pyxhook
import os

W_Key = False
A_Key = False
S_Key = False
D_Key = False


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
    global W_Key
    global A_Key
    global S_Key
    global D_Key

    print (event.Key)
    if event.Key == 'w':
        W_Key = True
    elif event.Key == 'a':
        A_Key = True
    elif event.Key == 's':
        S_Key = True
    elif event.Key == 'd':
        D_Key = True
    input = {W_Key, A_Key, S_Key, D_Key}
    input = '{}{}{}{}'.format(W_Key, A_Key, S_Key, D_Key)
    connection.send(input.encode())

def OnKeyRelease(event):
    global W_Key
    global A_Key
    global S_Key
    global D_Key

    print (event.Key)
    if event.Key == 'w':
        W_Key = False
    elif event.Key == 'a':
        A_Key = False
    elif event.Key == 's':
        S_Key = False
    elif event.Key == 'd':
        D_Key = False
    input = {W_Key, A_Key, S_Key, D_Key}
    input = '{}{}{}{}'.format(W_Key, A_Key, S_Key, D_Key)
    connection.send(input.encode())

if __name__ == '__main__':
    connection = ''
    send_inputs()

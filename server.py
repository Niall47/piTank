import socket
import time
import pyxhook
import os
import json

W_Key = False
A_Key = False
S_Key = False
D_Key = False
PreviousPayload = {}


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
    global PreviousPayload
    WhatKey(event.Key, True)
    if (FormatMessage() != PreviousPayload):
        connection.send(json.dumps(FormatMessage()).encode())
        PreviousPayload = FormatMessage()

def OnKeyRelease(event):
    global PreviousPayload
    WhatKey(event.Key, False)
    if (FormatMessage() != PreviousPayload):
        connection.send(json.dumps(FormatMessage()).encode())
        PreviousPayload = FormatMessage()

def WhatKey(key, action):
    global W_Key
    global A_Key
    global S_Key
    global D_Key

    if key == 'w':
        W_Key = action
    elif key == 'a':
        A_Key = action
    elif key == 's':
        S_Key = action
    elif key == 'd':
        D_Key = action
        
def FormatMessage():
    global W_Key
    global A_Key
    global S_Key
    global D_Key
    return {
        "W": W_Key,
        "A": A_Key,
        "S": S_Key,
        "D": D_Key
        }

if __name__ == '__main__':
    connection = ''
    send_inputs()

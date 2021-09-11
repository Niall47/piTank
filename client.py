
import socket
import RPi.GPIO as GPIO
import json

GPIO.setmode(GPIO.BOARD)
GPIO.setup(7,GPIO.OUT)
GPIO.setup(11,GPIO.OUT)
GPIO.setup(13,GPIO.OUT)
GPIO.setup(15,GPIO.OUT)
GPIO.setup(16,GPIO.OUT)

def cleanup():
    print('Resetting GPIO pins')
    GPIO.output(7,False)
    GPIO.output(11,False)
    GPIO.output(13,False)
    GPIO.output(15,False)
    GPIO.output(16,False)
    GPIO.cleanup()

def forward():
    GPIO.output(7,True)
    GPIO.output(15,True)
    GPIO.output(11,False)
    GPIO.output(13,True)

def backward():
    GPIO.output(11,True)
    GPIO.output(7,True)
    GPIO.output(15,False)
    GPIO.output(13,True)

def left():
    GPIO.output(11,True)
    GPIO.output(7,True)
    GPIO.output(13,True)
    GPIO.output(15,True)

def right():
    GPIO.output(7,True)
    GPIO.output(13,True)
    GPIO.output(15,False)
    GPIO.output(11,False)

def left_forward():
    GPIO.output(7,True)
    GPIO.output(11,False)
    GPIO.output(13,False)
    GPIO.output(15,False)

def left_backward():
    GPIO.output(11,True)
    GPIO.output(7,True)
    GPIO.output(13,False)
    GPIO.output(15,False)

def right_forward():
    GPIO.output(13,True)
    GPIO.output(7,False)
    GPIO.output(11,False)
    GPIO.output(15,False)

def right_backward():
    GPIO.output(15,True)
    GPIO.output(7,False)
    GPIO.output(11,False)
    GPIO.output(13,True)

def idle():
    print('Idling')
    GPIO.output(7,False)
    GPIO.output(11,False)
    GPIO.output(13,False)
    GPIO.output(15,False)

def client():
    print('Connecting to server')
    host = '192.168.0.47'
    port = 5000
    client_socket = socket.socket()
    client_socket.connect((host, port))
    GPIO.output(16,True)

    while True:
        data = client_socket.recv(1024).decode()
        UpdateSteering(json.loads(data))

def UpdateSteering(i):
    
    if i == {'W': True, 'A': False, 'S': False, 'D': False}:
        forward()
    elif i == {'W': True, 'A': False, 'S': False, 'D': True}:
        right_forward()
    elif i == {'W': False, 'A': False, 'S': False, 'D': True}:
        right()
    elif i == {'W': False, 'A': False, 'S': True, 'D': True}:
        right_backward()
    elif i == {'W': False, 'A': False, 'S': True, 'D': False}:
        backward()
    elif i == {'W': False, 'A': True, 'S': True, 'D': False}:
        left_backward()
    elif i == {'W': False, 'A': True, 'S': False, 'D': False}:
        left()
    elif i == {'W': True, 'A': True, 'S': False, 'D': False}:
        left_forward()
    else: 
        idle()


if __name__ == '__main__':
    cleanup()
    client()

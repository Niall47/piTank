
import socket
import RPi.GPIO as GPIO
import json
import time
import pyxtension

GPIO.setmode(GPIO.BOARD)
GPIO.setup(7,GPIO.OUT)
GPIO.setup(11,GPIO.OUT)
GPIO.setup(13,GPIO.OUT)
GPIO.setup(15,GPIO.OUT)
GPIO.setup(16,GPIO.OUT)

def led(status):
    if status == 'on':
        GPIO.output(16,True)
    else:
        GPIO.output(16,True)
    

def cleanup():
    GPIO.output(7,False)
    GPIO.output(11,False)
    GPIO.output(13,False)
    GPIO.output(15,False)
    GPIO.output(16,False)
    GPIO.cleanup()

def forward():
    print('Moving forward')
    GPIO.output(7,True)
    GPIO.output(15,True)
    GPIO.output(11,False)
    GPIO.output(13,True)

def backward():
    print('Moving backward')
    GPIO.output(11,True)
    GPIO.output(7,True)
    GPIO.output(15,False)
    GPIO.output(13,True)

def left():
    print('Moving left')
    GPIO.output(11,True)
    GPIO.output(7,True)
    GPIO.output(13,True)
    GPIO.output(15,True)

def right():
    print('Moving right')
    GPIO.output(7,True)
    GPIO.output(13,True)
    GPIO.output(15,False)
    GPIO.output(11,False)

def left_forward():
    print('Moving left forward')
    GPIO.output(7,True)
    GPIO.output(11,False)
    GPIO.output(13,False)
    GPIO.output(15,False)

def left_backward():
    print('Moving left backward')
    GPIO.output(11,True)
    GPIO.output(7,True)
    GPIO.output(13,False)
    GPIO.output(15,False)

def right_forward():
    print('Moving backward')
    GPIO.output(13,True)
    GPIO.output(7,False)
    GPIO.output(11,False)
    GPIO.output(15,False)

def right_backward():
    print('Moving right backward')
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
    host = '192.168.0.47'
    # host = socket.gethostname()
    port = 5000

    client_socket = socket.socket()
    client_socket.connect((host, port))

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
        print(i)

if __name__ == '__main__':
    client()

import RPi.GPIO as GPIO
import os
import pygame

GPIO.setmode(GPIO.BOARD)
GPIO.setup(7,GPIO.OUT)
GPIO.setup(11,GPIO.OUT)
GPIO.setup(13,GPIO.OUT)
GPIO.setup(15,GPIO.OUT)

screen = pygame.display.set_mode([240, 160])

while True:
	for event in pygame.event.get():
		if event.type == pygame.KEYDOWN:
			if event.key == pygame.K_w:
				print('Right')
			if event.key == pygame.K_d:
				print('Left')
			if event.key == pygame.K_a:
				print('Up')
			if event.key == pygame.K_s:
				print('Down')
			if event.key == pygame.K_q:
				pygame.quit()
		elif event.type == pygame.KEYUP:
			print('No key pressed')


def forward():
    print ('Forward')
    GPIO.output(7,True)
    GPIO.output(15,True)
    GPIO.output(11,False)
    GPIO.output(13,True)


def backward():
    print ('Backward')
    GPIO.output(11,True)
    GPIO.output(7,True)
    GPIO.output(15,False)
    GPIO.output(13,True)

def left():
    print ('Turn Left')
    GPIO.output(11,True)
    GPIO.output(7,True)
    GPIO.output(13,True)
    GPIO.output(15,True)

def right():
    print ('Turn Right')
    GPIO.output(7,True)
    GPIO.output(13,True)
    GPIO.output(15,False)
    GPIO.output(11,False)

def left_forward():
    print('Left Forward')
    GPIO.output(7,True)
    GPIO.output(11,False)
    GPIO.output(13,False)
    GPIO.output(15,False)

def left_backward():
    print('Left Backward')
    GPIO.output(11,True)
    GPIO.output(7,True)
    GPIO.output(13,False)
    GPIO.output(15,False)

def left_backward():
    print('Right Backward')
    GPIO.output(13,True)
    GPIO.output(7,False)
    GPIO.output(11,False)
    GPIO.output(15,False)

def right_backward():
    print('Right Forward')
    GPIO.output(15,True)
    GPIO.output(7,False)
    GPIO.output(11,False)
    GPIO.output(13,True)

def idle():
    GPIO.output(7,False)
    GPIO.output(11,False)
    GPIO.output(13,False)
    GPIO.output(15,False)

def shutdown():
    GPIO.output(7,False)
    GPIO.output(11,False)
    GPIO.output(13,False)
    GPIO.output(15,False)
    GPIO.cleanup()

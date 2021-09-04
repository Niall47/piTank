import RPi.GPIO as GPIO
import os
import pygame

GPIO.setmode(GPIO.BOARD)
GPIO.setup(7,GPIO.OUT)
GPIO.setup(11,GPIO.OUT)
GPIO.setup(13,GPIO.OUT)
GPIO.setup(15,GPIO.OUT)

screen = pygame.display.set_mode([240, 160])

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

def left_backward():
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

while True:
	for event in pygame.event.get():
		if event.type == pygame.KEYDOWN:
			if event.key == pygame.K_d:
				right()
			if event.key == pygame.K_a:
				left()
			if event.key == pygame.K_w:
				forward()
			if event.key == pygame.K_s:
				backward()
			if event.key == pygame.K_q:
				pygame.quit()
		elif event.type == pygame.KEYUP:
			idle()
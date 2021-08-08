import RPi.GPIO as GPIO
import time 

GPIO.setmode(GPIO.BOARD)
GPIO.setup(7,GPIO.OUT)
GPIO.setup(11,GPIO.OUT)
GPIO.setup(13,GPIO.OUT)
GPIO.setup(15,GPIO.OUT)

pins = [7, 11, 13, 15]

for i in pins:
	GPIO.output(i, True)
	print("Pin: " ,i)
	time.sleep(1)
	GPIO.output(i, False)
	time.sleep(1)	
GPIO.cleanup()

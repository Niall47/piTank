
import RPi.GPIO as GPIO

GPIO.setmode(GPIO.BOARD)
GPIO.setwarnings(False)
GPIO.setup(7,GPIO.OUT)
GPIO.setup(11,GPIO.OUT)
GPIO.setup(13,GPIO.OUT)
GPIO.setup(15,GPIO.OUT)
GPIO.setup(16,GPIO.OUT)

GPIO.output(7,False)
GPIO.output(11,False)
GPIO.output(13,False)
GPIO.output(15,False)
GPIO.output(16,False)

GPIO.cleanup()

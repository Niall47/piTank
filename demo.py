import RPi.GPIO as GPIO
import os #added so we can shut down OK
import time #import time modul



#set GPIO numbering mode and define output pins
GPIO.setmode(GPIO.BOARD)
GPIO.setup(7,GPIO.OUT)
GPIO.setup(11,GPIO.OUT)
GPIO.setup(13,GPIO.OUT)
GPIO.setup(15,GPIO.OUT)



print ('Forward')
GPIO.output(7,True)
GPIO.output(15,True)
GPIO.output(11,False)
GPIO.output(13,True)
time.sleep(2)

print ('Backward')
GPIO.output(11,True)
GPIO.output(7,True)
GPIO.output(15,False)
GPIO.output(13,True)
time.sleep(2)


print ('Turn Left')
GPIO.output(11,True)
GPIO.output(7,True)
GPIO.output(13,True)
GPIO.output(15,True)
time.sleep(2)

print ('Turn Right')
GPIO.output(7,True)
GPIO.output(13,True)
GPIO.output(15,False)
GPIO.output(11,False)
time.sleep(2)



print('Left Forward')
GPIO.output(7,True)
GPIO.output(11,False)
GPIO.output(13,False)
GPIO.output(15,False)
time.sleep(1)

print('Left Backward')
GPIO.output(11,True)
GPIO.output(7,True)
GPIO.output(13,False)
GPIO.output(15,False)

time.sleep(1)

print('Right Backward')
GPIO.output(13,True)
GPIO.output(7,False)
GPIO.output(11,False)
GPIO.output(15,False)

time.sleep(1)

print('Right Forward')
GPIO.output(15,True)
GPIO.output(7,False)
GPIO.output(11,False)
GPIO.output(13,True)





time.sleep(2)

GPIO.output(7,False)
GPIO.output(11,False)
GPIO.output(13,False)
GPIO.output(15,False)
GPIO.cleanup()





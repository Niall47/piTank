const timer = ms => new Promise( res => setTimeout(res, ms));
const Gpio = require('pigpio').Gpio;
const left_pos = new Gpio(13, {mode: Gpio.OUTPUT});
const left_neg = new Gpio(19, {mode: Gpio.OUTPUT});
const right_pos = new Gpio(18, {mode: Gpio.OUTPUT});
const right_neg = new Gpio(12, {mode: Gpio.OUTPUT});
let interval = 1000;

(async function(){
  console.log("left pos - 13")
  left_pos.pwmWrite(255)
  await timer(interval);
  left_pos.pwmWrite(0)
  console.log("left neg - 19")
  left_neg.pwmWrite(255)
  await timer(interval);
  left_neg.pwmWrite(0)

  console.log("right pos - 18")
  right_pos.pwmWrite(255)
  await timer(interval);
  right_pos.pwmWrite(0)
  console.log("right neg - 12")
  right_neg.pwmWrite(255)
  await timer(interval);
  right_neg.pwmWrite(0)
  console.log("done")
})()


left_pos.pwmWrite(0)
left_neg.pwmWrite(0)
right_pos.pwmWrite(0)
right_neg.pwmWrite(0)
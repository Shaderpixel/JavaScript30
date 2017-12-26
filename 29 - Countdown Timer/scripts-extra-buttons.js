//-- Declare variables
let countdown;
let isPaused = false , addTime = false, minusTime = false;
const timerDisplay = document.querySelector('.display__time-left');
const endTime = document.querySelector('.display__end-time');
const buttons = document.querySelectorAll('button[data-time]');
const form = document.customForm; //selcting element if it has a name attrbute seemst to only work on forms
const resetButton = document.querySelector('[name="timerReset"]');
const pauseButton = document.querySelector('[name="timerPause"]');
const addTimeButton = document.querySelector('[name="timerPlus10"]');
const minusTimeButton = document.querySelector('[name="timerMinus1"]');



//-- Write functions
function clearTimer() {
  clearInterval(countdown);
  timerDisplay.textContent = "00:00";

  //reset all variables
  isPaused = false;
  addTime = false;
  minusTime = false;
}

function reduceTime(then) {
  return then - parseInt(minusTimeButton.dataset.lessTime) * 1000;
}

function increaseTime(then) {
  return then + parseInt(addTimeButton.dataset.extraTime) * 1000;
}

function timer(seconds) {
  //clear existing imers
  clearTimer();
  console.log(seconds);
  const now = Date.now();
  let then = now + seconds * 1000;
  let pausedRemainder = 0, i = 0;

  //display time left right away since setInterval only triggers after a second has passed
  displayTimeLeft(seconds);
  displayEndTime(then);

  countdown = setInterval(() => {

    //if timer is paused need to update then value
    if (isPaused) {
      //if i is first iteration, calculate and set pausedRemainder, otherwise pausedRemainder's value keeps updated while isPaused is true
      if (i === 0) {
        pausedRemainder = then - Date.now();
      }

      i++; //increment i
    } else {
      //if timer was previously paused, recalculate then
      if (pausedRemainder > 0 && pausedRemainder < 1000) {
        //one second remaining, so clear interval
        clearTimer();
        return;

      } else if (pausedRemainder > 0) {
        //call timer again and pass remaining seconds
        timer(Math.round(pausedRemainder/1000));
        return;
      }

      //add extra time
      if (addTime) {
        then = increaseTime(then);
        displayEndTime(then);
        addTime = false;
      }

      //minus time
      if (minusTime) {
        //make sure that left over time is > 0 seconds to display otherwise go straight to clear interval
        then = reduceTime(then);

        const reducedSecondsLeft = Math.round((then - Date.now())/1000);

        displayEndTime(then);

        //if remaining time is less than one seconds, go ahead and end interval
        if (reducedSecondsLeft < 1) {
          clearTimer();
          return;
        } else {
          //reset minusTime variable
          minusTime = false;
        }

      }

      const secondsLeft = Math.round((then - Date.now()) / 1000);

      //stop timer is remaining time is less than 0
      if (secondsLeft < 0) {
        clearTimer();
        return;
      }

      //display time left
      displayTimeLeft(secondsLeft);
    }

  }, 1000);
}

function displayTimeLeft(seconds) {
  const minutes = Math.floor(seconds / 60);
  remainderSeconds = seconds % 60;

  const display = `${minutes}:${remainderSeconds < 10 ? '0' : ''}${remainderSeconds}`
  document.title = display;
  timerDisplay.textContent = display;
}

function displayEndTime(timestamp) {
  const end = new Date(timestamp);
  const hours = end.getHours();
  const minutes = end.getMinutes();
  const seconds = end.getSeconds();

  endTime.textContent = `Be back at ${hours > 12 ? hours - 12 : hours}:${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds} ${hours > 12 ? 'PM' : 'AM'}`;
}

function startTimer() {
  const seconds = parseInt(this.dataset.time);
  timer(seconds);
}

function customTime(e) {
  e.preventDefault();
  const mins = this.minutes.value;
  timer(mins*60);
  this.reset();
}


//-- Attach event listeners
buttons.forEach(button => button.addEventListener('click', startTimer));
form.addEventListener('submit', customTime);
resetButton.addEventListener('click', clearTimer);

//switch value only if timer is countdown is running
pauseButton.addEventListener(('click'), () => isPaused = countdown ? !isPaused : false); //isPaused is always false if countdown is not running
addTimeButton.addEventListener(('click'), () => addTime = countdown ? true : false);
minusTimeButton.addEventListener(('click'), () => minusTime = countdown ? true : false);


//which lesson is it where this or something else is passed through the event handler?
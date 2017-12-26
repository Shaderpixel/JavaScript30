//Declare your variables
let countdown;
const buttons = document.querySelectorAll('button');
const timerDisplay = document.querySelector('.display__time-left');
const endTime = document.querySelector('.display__end-time');

function timer(seconds) {
  //clear any existing countdown timers
  clearInterval(countdown);

  const now = Date.now();
  const then = now + seconds * 1000;

  //display starting time left immediately
  displayTimeLeft(seconds);
  //display end time
  displayEndTime(then);

  countdown = setInterval(() => {
    const secondsLeft = Math.round((then - Date.now()) / 1000);

    //check if we should stop the interval
    if (secondsLeft < 0) {
      clearInterval(countdown);
      return;
    }

    //display time remaining
    displayTimeLeft(secondsLeft);

  }, 1000);
}

function displayTimeLeft(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainderSeconds = seconds % 60;
  const displayTime = `${minutes}:${remainderSeconds < 10 ? '0' : ''}${remainderSeconds}`;
  //display time in page area
  timerDisplay.textContent = displayTime;
  //display time in browser tab header
  document.title = displayTime;
}

function displayEndTime(timestamp) {
  const end = new Date(timestamp);
  const hour = end.getHours();
  const adjustedHour = hour > 12 ? hour - 12 : hour;
  const minutes = end.getMinutes();
  const adjustedMinutes = `${minutes < 10 ? '0' : ''}${minutes}`;

  endTime.textContent = `Be Back At ${adjustedHour}:${adjustedMinutes}${hour > 12 ? 'pm' : 'am'}`;
}

function startTimer() {
  const seconds = parseInt(this.dataset.time);
  timer(seconds);
}

buttons.forEach(button => {
  button.addEventListener('click', startTimer);
});

//selecting the form using its name attribute
document.customForm.addEventListener('submit', function(e) {
  e.preventDefault(); //prevent form from sending data over a get
  //selecting the input field using the name attribute
  const mins = this.minutes.value;
  timer(mins*60);
  this.reset();
});

/*
Lesson Learnt
1. setInterval doesn't run when you switch away from a tab after a period
2. setInterval doesn't run on IOS during scrolling
3. new static method on Date object called Date.now() otherwise the old way is to declare  new Date().getTime()
4. setting return in the setInterval function prevent it from displaying the console.log but it will still run in the background, so we have to store the interval in a variable
5. setInterval does not run immediately, it has to wait for the first second to elapse
6. Date.now() gives the the time in miliseconds from the very beginning of time, to get the current hour and seconds we need to create a date object and extract those information from the miliseconds
7. multiple setIntervals are queued up, new setIntervals do not override old ones
8. you can select elements if they have a name e.g. document.parentName.childName
*/
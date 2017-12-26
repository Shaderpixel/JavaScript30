//-- Declare variables
let countdown;
const timerDisplay = document.querySelector('.display__time-left');
const endTime = document.querySelector('.display__end-time');
const buttons = document.querySelectorAll('button[data-time]');
const form = document.customForm; //selcting element if it has a name attrbute seems to only work on forms



//-- Write functions
function clearTimer() {
  clearInterval(countdown);
  timerDisplay.textContent = "00:00";
  endTime.textContent = "00:00";
}


function timer(seconds) {
  //clear existing imers
  clearTimer();

  const now = Date.now();
  const then = now + seconds * 1000;

  //display time left right away since setInterval only triggers after a second has passed
  displayTimeLeft(seconds);
  displayEndTime(then);

  countdown = setInterval(() => {
    const secondsLeft = Math.round((then - Date.now()) / 1000);

    //check if we stop it before it goes negative
    if (secondsLeft < 0) {
      clearInterval(countdown);
      return;
    }

    //display time left
    displayTimeLeft(secondsLeft);

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

  endTime.textContent = `Be back at ${hours > 12 ? hours - 12 : hours}:${minutes < 10 ? '0' : ''}${minutes} ${hours > 12 ? 'PM' : 'AM'}`;
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


//add hours ? animations? pause? resume? add 10 secs?
//what was that event handler where I have pass the calling object (or was it an event) to the function as this
//is theere a pause interval?
//or do we need to create another variable to hold the seconds
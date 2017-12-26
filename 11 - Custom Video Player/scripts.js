//------declare variables
const player = document.querySelector('.player');
const video = player.querySelector('video.viewer');
const progress = document.querySelector('.progress');
const progressBar = progress.querySelector('.progress__filled');
const bufferBar = progress.querySelector('.buffer__filled');
const toggle = player.querySelector('.toggle');
const skipButtons = player.querySelectorAll('[data-skip]');
const fullscreenButton = player.querySelector('.fullScreen');
const ranges = player.querySelectorAll('.player__slider');
const vendorVidPrefixes = {
  //capital Screen for moz
  moz: {
    fsEnabled: "mozFullScreenEnabled",
    requestFS: "mozRequestFullScreen"
  },
  webkit: {
    fsEnabled: "webkitFullscreenEnabled",
    requestFS: "webkitRequestFullscreen"
  },
  ms: {
    fsEnabled: "msFullscreenEnabled",
    requestFS: "msRequestFullscreen"
  },
  unprefixed: {
    fsEnabled: "fullscreenEnabled",
    requestFS: "requestFullscreen"
  }
};

//mouse down flags
let rangeClick = false;
let progressClick = false;

//------write function
function togglePlay() {
  const method = video.paused ? 'play' : 'pause';
  video[method]();
}

function updateButton() {
  toggle.textContent = this.paused ? '►' : '❚ ❚';
}

function skip() {
  video.currentTime += parseFloat(this.dataset.skip);
}

function handleRangeUpdate(e) {
  video[e.target.name] = e.target.value;
}

function handleBuffer() {
  if (video.buffered.length == 1) {
    const bufferedTime = video.buffered.end(0);
    const bufferWidth = (bufferedTime / video.duration * progress.offsetWidth).toFixed(2);
    bufferBar.style.width = `${bufferWidth}px`;

  }
}

function handleProgress() {
  // console.log(`current time: ${video.currentTime}`);
  const percentage =  video.currentTime / video.duration * 100;
  progressBar.style.flexBasis = `${percentage}%`;
}

function scrub(e) {
  const scrubTime = e.offsetX / progress.offsetWidth * video.duration;
  video.currentTime = scrubTime;
}

function makeFullscreen() {
  //https://stackoverflow.com/questions/921789/how-to-loop-through-plain-javascript-object-with-objects-as-members
Object.keys(vendorVidPrefixes).forEach((prefix) => {
  const fsEnabled = vendorVidPrefixes[prefix].fsEnabled;
  const requestFS = vendorVidPrefixes[prefix].requestFS;

  if (document[fsEnabled] && video[requestFS]) {
      video[requestFS]();
  }
});


  // if (video.requestFullscreen && document.fullscreenEnabled) {
  //     video.requestFullscreen();
  // }
}

//------write eventhandlers
//video player events
video.addEventListener('click', togglePlay);
video.addEventListener('play', updateButton);
video.addEventListener('pause', updateButton);
video.addEventListener('timeupdate', handleProgress);
video.addEventListener('timeupdate', handleBuffer);

//update bufferBar on window resize (since not flexbasis)
window.addEventListener('resize', handleBuffer);

//video playtime skip event
skipButtons.forEach(skipButton => skipButton.addEventListener('click', skip));

//range change events
ranges.forEach(range => {
  range.addEventListener('mousedown', () => rangeClick = true);
  range.addEventListener('mouseup', () => rangeClick = false);
  range.addEventListener('change', handleRangeUpdate);
  range.addEventListener('mousemove', (e) => rangeClick && handleRangeUpdate(e));
});

//video play event
toggle.addEventListener('click', togglePlay);

//video scrubbing events
progress.addEventListener('click', scrub);
progress.addEventListener('mousedown', () => progressClick = true);
progress.addEventListener('mouseup', () => progressClick = false);
progress.addEventListener('mousemove', (e) => progressClick && scrub(e));


//make full screen event
fullscreenButton.addEventListener('click', makeFullscreen);


//initialize progress and buffer bar
document.addEventListener('DOMContentLoaded', () => video.preload = "meta");
video.addEventListener('loadedmetadata', handleProgress);
video.addEventListener('canplay', handleBuffer);

//what is a good way to loop through objects in object?
//displayed buffered parts?

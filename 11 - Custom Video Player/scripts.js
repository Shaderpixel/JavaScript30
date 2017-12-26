//Get Our Elements
const player = document.querySelector('.player');
const video = player.querySelector('.viewer');
const progress = player.querySelector('.progress');
const progressBar = player.querySelector('.progress__filled');
const toggle = player.querySelector('.toggle');
const skipButtons = player.querySelectorAll('[data-skip]');
const ranges = player.querySelectorAll('.player__slider');
const fullscreen = player.querySelector('.fullScreen')

let mouseDown = false;
//----> Build Our Functions
// play or pause the video
function togglePlay() {
    const method = video.paused ? 'play' : 'pause';
    video[method](); //another way of calling properties just like object['propertyName']
}

// change the icon on the play button
function updateButton() {
    //using this because its bound to the video itself
    const icon = this.paused ? '►' : '❚ ❚';
    toggle.textContent = icon;
}

// skip forward or backwards
function skip() {
    console.log(this.dataset.skip);
    console.log(video.currentTime);
    video.currentTime += parseFloat(this.dataset.skip);
    console.log(video.currentTime);
}

//change volume or playback speed
function handleRangeUpdate(e) {
    console.log(e.target.value);
    video[e.target.name] = e.target.value;
}

//update progressbar fill
function handleProgress() {
    //reflect current video progress in the progress bar
    const percent = (video.currentTime / video.duration) * 100;
    progressBar.style.flexBasis = `${percent}%`;
}


function scrub(e) {
    // console.log(e.target);
    // console.log(`Target offsetWidth ${e.target.offsetWidth}`);
    // console.log(`Progress offsetWidth ${progress.offsetWidth}`);
    const scrubTime = (e.offsetX / progress.offsetWidth) * video.duration;
    video.currentTime = scrubTime;
}

function makeFullScreen() {
    const vp = determineVendorPrefix();
    if (document[`${vp}FullscreenEnabled`]) {
        if (!document[`${vp}FullscreenElement`]) {
            video[`${vp}RequestFullScreen`]();
        } else {
            document[`${vp}ExitFullscreen`]();
        }
    }
}

function determineVendorPrefix() {
    const sUsrAg = navigator.userAgent;

    if(sUsrAg.indexOf("Chrome") > -1) {
        return 'webkit';
    } else if (sUsrAg.indexOf("Safari") > -1) {
        return 'webkit';
    } else if (sUsrAg.indexOf("Opera") > -1) {
        return '';
    } else if (sUsrAg.indexOf("Firefox") > -1) {
        return 'moz';
    } else if (sUsrAg.indexOf("MSIE") > -1) {
        return 'ms';
    }
}

//---->Hook up the event listeners

//play video
video.addEventListener('click', togglePlay);
video.addEventListener('play', updateButton);
video.addEventListener('pause', updateButton);
toggle.addEventListener('click', togglePlay);

//skip ahead video
skipButtons.forEach(button => button.addEventListener('click', skip));

//Ranges for volume and playback speed
ranges.forEach(range => range.addEventListener('change', handleRangeUpdate));
//to change range only when hovering cursor over input with mouse key down
ranges.forEach(range => range.addEventListener('mousemove', (e) => mouseDown && handleRangeUpdate(e)));
ranges.forEach(range => addEventListener('mousedown', () => mouseDown = true));
ranges.forEach(range => addEventListener('mouseup', () => mouseDown = false));
ranges.forEach(range => addEventListener('mouseout', () => mouseDown = false));

//update progressbar and scrubbing
video.addEventListener('timeupdate', handleProgress);
progress.addEventListener('click', scrub);
progress.addEventListener('mousemove', (e) => mouseDown && scrub(e));
//to scrub only when hovering cursor over progress with mouse key down
progress.addEventListener('mousedown', () => mouseDown = true);
progress.addEventListener('mouseup', () => mouseDown = false);
progress.addEventListener('mouseout', () => mouseDown = false);

//enter & exit fullscreen
fullscreen.addEventListener('click', makeFullScreen);

//update progressbar fill on page load
document.addEventListener("DOMContentLoaded", function(){
    video.preload = "metadata";
})
video.addEventListener('loadedmetadata', handleProgress);


/*
Lesson Learnt
1. video has a property called .paused but not one for checking playing
3. video.pause() video.play()
2. video.currentTime
4. button.textContent instead of changing the button text in the togglePlay function we should listen to the video to see if its playing or not because video can be played using JS (libraries out there ) without messing with the button
5.parseFloat('string') converts string into numbers
7. name attribute is already part of the element property so instead of this.getAttribute('name') we can just call this.name
8. video doesn't have a duration until the source metadata is fetched
9. playing event only triggers once from the paused state to play
10. The timeupdate event is fired when the time indicated by the currentTime attribute has been updated.
11. arrow function without passing in any parameters () => mouseDown = false
12. progress.addEventListener('mousemove', (e) => mouseDown && scrub(e));
    - what this does is that when someone move their mouse, it will first check if mouseDown is true then move on to scrub. and now since we are using the anonnymous inline arrow function to call scrub(), we have lost what the original information from the mousemove event; we need to pass the initial event variable back into scrub fn. if mouseDown is false it won't run scrub. We are hijacking the && operator
13. In the scrub function we can't use e.target.offsetWidth to calculate the full width of the progress container, because depending on where the user clicks, the e.target can change to the inner container div.progress__filled and it will give the wrong width, therefore it has to be more specific
13. Fullscreen API is not standard yet among different vendor and requires vendor prefixes
    - document.fullscreenElement tells whether there is an element in full screen otherwise return null
    -document.fullscreenEnabled tells whether the document is in a state that allows fullscreen mode to be requested
Additional Challenge
-Add a fullscreen button

*/
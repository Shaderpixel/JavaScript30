const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');

function getVideo () {
  navigator.mediaDevices.getUserMedia({video: true, audio:false})
  .then(localMediaStream => {
    video.src = window.URL.createObjectURL(localMediaStream);
    video.play();
    })
  .catch(err => {
    console.error('web cam access is needed', err);
    });
}

function paintToCanvas() {
  //ensure vid dimensions match canvas dimensions
  const width = video.videoWidth;
  const height = video.videoHeight;
  canvas.width = width;
  canvas.height = height;

  //return the interval so that there is a way to call clearInterval on it
  return setInterval(() => {
    ctx.drawImage(video, 0, 0, width, height);

    //take the pixels out
    let pixels = ctx.getImageData(0, 0, width, height); //produces arrays of RGBA

    //mess with them
    // pixels = redEffect(pixels);
    // pixels = rgbSplit(pixels);
    // ctx.globalAlpha = 0.1;
    pixels = greenScreen(pixels);

    //put them back
    ctx.putImageData(pixels, 0, 0);





  }, 16);

}

function takePhoto() {
  //played the sound
  snap.currentTime = 0;
  snap.play();

  //take the data out of the canvas
  const data = canvas.toDataURL('image/jpeg');
  const link = document.createElement('a');
  link.href = data;
  link.setAttribute('download', 'handsome');
  link.innerHTML = `<img src="${data}" alt="Handsome Man"/>`;
  strip.insertBefore(link, strip.firstChild);
}


function redEffect(pixels) {
  for(let i = 0; i < pixels.data.length; i += 4) {
    pixels.data[i + 0] = pixels.data[i + 0] + 100; //red channel
    pixels.data[i + 1] = pixels.data[i + 1] - 50; //green channe;
    pixels.data[i + 2] = pixels.data[i + 2] * 0.5; //blue channel
  }

  return pixels;
}

function rgbSplit(pixels) {
  for(let i = 0; i < pixels.data.length; i += 4) {
    pixels.data[i - 150] = pixels.data[i + 0]; //red channel
    pixels.data[i + 500] = pixels.data[i + 1]; //green channe;
    pixels.data[i - 500] = pixels.data[i + 2]; //blue channel
  }

  return pixels;
}

function greenScreen(pixels) {
  const levels = {};

  document.querySelectorAll('.rgb input').forEach((input) => {
    levels[input.name] = input.value;
  });

  for(let i = 0; i < pixels.data.length; i = i + 4) {
    red = pixels.data[i + 0];
    green = pixels.data[i + 1];
    blue = pixels.data[i + 2];
    alpha = pixels.data[i + 3];

    if(red >= levels.rmin
    && green >= levels.gmin
    && blue >= levels.bmin
    && red <= levels.rmax
    && green <= levels.gmax
    && blue <= levels.bmax) {
        // change alpha to 0 so that it doesn't appear
        pixels.data[i + 3] = 0;
    }
  }

  return pixels;
}


//load up the video
getVideo();

//listen for the can play event
video.addEventListener('canplay', paintToCanvas);





//page on load, create vid element in JS if window dimensions > 768px
//add classes to hide it first and overlay it ontop of the image banner but beneath the image overlay and text
//add classes to hide if screen readjust < 768px
//once video event canplay, remove class that hide it
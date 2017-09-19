//----declare variables
const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');



//----functions
function getVideo() {
  navigator.mediaDevices.getUserMedia({video: true, audio: false})
    .then(localMediaStream => {
      //convert localMediaStream into URL and pass it as live stream
      video.src = window.URL.createObjectURL(localMediaStream);
      video.play();
    })
    .catch(err => {
      console.error(`oh No!!!`, err);
    })
}

function paintToCanvas() {
  //make sure that the canvas size is the same as the video size
  const width = video.videoWidth;
  const height = video.videoHeight;

  canvas.width = width;
  canvas.height = height;

  return setInterval(() => {
    // grab a picture every 16ms and put it into the canvas
    ctx.drawImage(video, 0, 0, width, height);

    //take the pixels out
    let pixels = ctx.getImageData(0,0, width, height);
    //mess with pixels

    // pixels = redEffect(pixels);

    // pixels = rgbSplit(pixels);
    // ctx.globalAlpha = 0.5;

    pixels = greenScreen(pixels);

    //put them back
    ctx.putImageData(pixels, 0, 0);
  }, 16);
}

function takePhoto() {
  //photo taking sound
  snap.currentTime = 0;
  snap.play();

  //take the data out of the canvas, can change the image to png too
  const data = canvas.toDataURL('image/jpeg');
  console.log(data);
  const link = document.createElement('a');
  link.href = data;
  link.setAttribute('download', 'photoBooth');
  link.innerHTML = `<img src="${data}" alt="photoBooth Picture">`
  strip.insertBefore(link, strip.firstChild);
}

function redEffect(pixels) {
  //using for loop here because the pixels array is a different kind of array
  //that doesn't have the regular methods like regular arrays have
  for (let i = 0; i < pixels.data.length; i += 4) {
    pixels.data[i + 0] = pixels.data[i + 0] + 100; //red
    pixels.data[i + 1] = pixels.data[i + 1] - 50; //green
    pixels.data[i + 2] = pixels.data[i + 2] * 0.5; //blue
  }
  return pixels;
}

function rgbSplit(pixels) {
  for (let i = 0; i < pixels.data.length; i += 4) {
    //set future/past pixels = current information
    pixels.data[i - 150] = pixels.data[i + 0]; //red
    pixels.data[i + 100] = pixels.data[i + 1]; //green
    pixels.data[i - 150] = pixels.data[i + 2]; //blue
  }
  return pixels;
}

function greenScreen(pixels) {
  const levels = {};

  document.querySelectorAll('.rgb input').forEach((input) => {
    levels[input.name] = input.value;
  });

  console.log(levels);

  for (let i = 0; i < pixels.data.length; i += 4) {
    red = pixels.data[i + 0];
    green = pixels.data[i + 1];
    blue = pixels.data[i + 2];
    alpha = pixels.data[i + 3];

    if (red >= levels.rmin
      && green >= levels.gmin
      && blue >= levels.bmin
      && red <= levels.rmax
      && green <= levels.gmax
      && blue <= levels.bmax) {
      // take it out by setting alpha to 0!
      pixels.data[i + 3] = 0;
    }
  }

  return pixels;
}

getVideo();

//----attach event handler
//listen for a the event where the browser can play the media from getVideo
video.addEventListener('canplay', paintToCanvas);



/*
Lesson Leart
video is being piped into the canvas
1. drawImage gets a video/image source and paint it onto the canvas beginning at the position of 0,0 top left corner of the canvas and paint the dimensions
2. when you return the setInterval function then we can stop the drawImage from painting
3. video can emit an event of canplay - The browser can play the media, but estimates that not enough data has been loaded to play the media up to its end without having to stop for further buffering of content.
4. navigator.mediaDevices.getUserMedia({video: true, audio: false}) returns a promise called a MediaStream and needs to be converted into a url before video player can use it. the SRC of the video turns out to be a blob
5. The filter works by taking pixel information out of the canvas, transform it, and place it back into the canvas.





*/
/**
 * Thanks to: https://github.com/drejkim/face-detection-node-opencv
 */
const path = require('path');
const cv = require('opencv');
const { Subject } = require('rxjs');

// camera properties
const camWidth = 320;
const camHeight = 240;
const camFps = 10;
const camInterval = 1000 / camFps;

const faces$ = new Subject();

const camera = new cv.VideoCapture(0);
camera.setWidth(camWidth);
camera.setHeight(camHeight);

const dataPath = path.dirname(cv.FACE_CASCADE);

function getImage() {
  return new Promise((resolve, reject) => {
    camera.read((err, im) => {
      if (err) reject(err);
      resolve(im);
    });
  });
}

async function readFaces() {
  const facesParams = [];
  const im = await getImage();
  return new Promise((resolve, reject) => {
    // cv.FACE_CASCADE
    im.detectObject(path.join(dataPath, '/haarcascade_frontalface_alt2.xml'), {}, (faceErr, faces) => {
      if (faceErr) reject(faceErr);

      for (let i = 0; i < faces.length; i++) {
        const {
          x, y, width, height,
        } = faces[i];
        facesParams.push({
          x,
          y,
          width,
          height,
          camWidth,
          camHeight,
        });
      }

      resolve(facesParams);
    });
  });
}


function start(interval = camInterval) {
  setInterval(async () => {
    try {
      const faces = await readFaces();
      faces$.next(faces);
    } catch (err) {
      faces$.error(err);
    }
  }, interval);

  return faces$;
}

module.exports = {
  startFaceDetection: start,
};

const cv = require('opencv');
const path = require('path');
const { logger } = require('../util/loggers');

// camera properties
// const camWidth = 320;
// const camHeight = 240;
const camWidth = 640;
const camHeight = 480;
const camFps = 10;
const camInterval = 1000 / camFps;

// const camId = 0; // internal
const camId = 1; // first usb webcam
const camera = new cv.VideoCapture(camId);
camera.setWidth(camWidth);
camera.setHeight(camHeight);

logger.info(`Connected to Camera ${camId} with dimens ${camWidth} x ${camHeight}`);

const dataPath = path.dirname(cv.FACE_CASCADE);

function getImage() {
  return new Promise((resolve, reject) => {
    camera.read((err, im) => {
      if (err) reject(err);
      resolve(im);
    });
  });
}

module.exports = {
  getImage,
  dataPath,
  camInterval,
  camWidth,
  camHeight
};

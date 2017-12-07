const cv = require('opencv');
const path = require('path');

// camera properties
const camWidth = 320;
const camHeight = 240;
const camFps = 10;
const camInterval = 1000 / camFps;


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

module.exports = {
  getImage,
  dataPath,
  camInterval,
  camWidth,
  camHeight
};

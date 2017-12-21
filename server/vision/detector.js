/**
 * Thanks to: https://github.com/drejkim/face-detection-node-opencv
 */
import { Body, Face, VisionObjectSet } from '../../common/models';

const path = require('path');
const cv = require('opencv');
const { Subject } = require('rxjs');

const {
  getImage, dataPath, camInterval, camWidth, camHeight,
} = require('./vision-utils');
const { logger } = require('../util/loggers');

const faces$ = new Subject();
const bodies$ = new Subject();

async function readFaces(im) {
  return new Promise((resolve, reject) => {
    // cv.FACE_CASCADE
    im.detectObject(path.join(dataPath, '/haarcascade_frontalface_alt2.xml'), {}, (faceErr, faces) => {
      if (faceErr) reject(faceErr);
      if (!faces || typeof faces === 'undefined') resolve([]);

      const allFaces = faces.map(params => {
        const {
          x, y, width, height,
        } = params;

        const face = new Face({
          x,
          y,
          width,
          height,
          camWidth,
          camHeight,
        });

        // logger.info('Found a face!', face);
        return face;
      });

      im.release(); // clear the memory
      resolve(allFaces);
    });
  });
}

async function readBodies(im) {
  return new Promise((resolve, reject) => {
    // cv.FULLBODY_CASCADE
    // path.join(dataPath, '/haarcascade_frontalface_alt2.xml')
    im.detectObject(cv.FULLBODY_CASCADE, {}, (bodyErr, bodies) => {
      if (bodyErr) reject(bodyErr);
      if (!bodies || typeof bodies === 'undefined') resolve([]);

      const allBodies = bodies.map((params) => {
        const {
          x, y, width, height,
        } = params;

        const body = new Body({
          x,
          y,
          width,
          height,
          camWidth,
          camHeight,
        });

        logger.info('Found a body!', body);
        return body;
      });

      im.release(); // clear the memory
      resolve(allBodies);
    });
  });
}

async function read() {
  const im = await getImage();
  // should make a copy of the image
  // readFaces(im).then(faces => faces$.next(new VisionObjectSet(Face.TYPE, faces))).catch(err => faces$.error(err));
  readBodies(im).then(bodies => bodies$.next(new VisionObjectSet(Body.TYPE, bodies))).catch(err => bodies$.error(err));
}

let readInveral;

function stop() {
  clearInterval(readInveral);
}

function start(interval = camInterval) {
  readInveral = setInterval(async () => {
    try {
      await read();
    } catch (err) {
      logger.error(err);
    }
  }, interval);

  return faces$.merge(bodies$);
}

module.exports = {
  startDetection: start,
  stopDetection: stop,
};

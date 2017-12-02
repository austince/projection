// import Maptastic from 'maptastic';
import Maptastic from 'maptastic/src/maptastic';

import BaseLayout from './layout.json';

const BASE_WIDTH = 1920;
const BASE_HEIGHT = 1080;

export default class Mapper {
  constructor(...ids) {
    const config = {
      autoSave: true,
      autoLoad: true,
      onchange: this.layoutsChanged.bind(this),
      crosshairs: false,
      labels: true,
      layers: ids,
    };
    this.map = Maptastic(config);
    this.setLayouts();
  }

  resize() {
    this.setLayouts();
  }

  layoutsChanged() {
    console.log('layouts changed');
  }

  getLayouts() {
    return this.map.getLayout();
  }

  setLayouts() {
    this.map.setLayout(BaseLayout);
    // this.map.setLayout(this.getLayouts(BASE_WIDTH, BASE_HEIGHT));
  }
}

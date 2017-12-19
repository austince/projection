// import Maptastic from 'maptastic';
import Maptastic from 'maptastic/src/maptastic';

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
  }

  resize() {
    this.setLayouts();
  }

  layoutsChanged() {
    console.log('layouts changed');
    const event = new CustomEvent('mappingresized');
    window.dispatchEvent(event);
  }

  getLayouts() {
    return this.map.getLayout();
  }

  setLayouts() {
    // this.map.setLayout(BaseLayout);
    // this.map.setLayout(this.getLayouts(BASE_WIDTH, BASE_HEIGHT));
  }
}

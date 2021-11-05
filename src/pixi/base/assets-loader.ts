import * as PIXI from 'pixi.js';
import {app} from './application';


export const loadAssets = () => {
  app.loader.add('bubble', 'bubble_32x32.png').load((loader, resources) => {
    const bubble = new PIXI.Sprite(resources.bubble.texture);


    // Rotate around the center
    bubble.anchor.set(0.5);

    // Add the bunny to the scene we are building
    app.stage.addChild(bubble);

    let delta = 0;

    // Listen for frame updates
    app.ticker.add(() => {
      // Setup the position of the bunny
      bubble.x = app.renderer.width / 2;
      bubble.y = app.renderer.height / 2;

      // each frame we spin the bunny around a bit
      const scale = 2 + Math.sin(delta);
      bubble.scale.set(scale);

      delta += 0.1;
    });
  });
};

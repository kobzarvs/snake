import {app} from '../base/application';


export const resize = () => {
  app.renderer.resize(window.innerWidth, window.innerHeight);
};

export const addResizer = () => {
  resize();
  window.addEventListener('resize', resize);
};

export const removeResizer = () => {
  window.removeEventListener('resize', resize);
};

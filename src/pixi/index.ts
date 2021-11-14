// import {app} from './base/application';
import {addResizer} from './features/resize';
import {loadAssets} from './base/assets-loader';
import './base/triangle';


export const init = () => {
  addResizer();
  loadAssets();
};

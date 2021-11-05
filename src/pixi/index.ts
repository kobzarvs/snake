// import {app} from './base/application';
import {addResizer} from './features/resize';
import {loadAssets} from './base/assets-loader';


export const init = () => {
  addResizer();
  loadAssets();
};

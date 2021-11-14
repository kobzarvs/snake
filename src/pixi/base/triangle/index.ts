import {app, Geometry, Mesh, Shader} from '../application';
import vertexShader from './vertex.glsl';
import fragShader from './fragment.glsl';


const geometry = new Geometry()
  .addAttribute('aVertexPosition', [-100, -50, 100, -50, 0, 100]);

let shader = Shader.from(vertexShader, fragShader, {
  iResolution: [window.innerWidth, window.innerHeight]
});

const index = new Mesh(geometry, shader);
index.position.set(window.innerWidth/2, window.innerHeight/2);

app.stage.addChild(index);

app.ticker.add((delta) => {
  index.rotation += 0.01;
});

document.addEventListener('mousemove', e => {
  index.position.set(e.pageX, e.pageY);
});

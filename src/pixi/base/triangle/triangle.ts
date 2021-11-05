import { app, Geometry, Mesh, Shader } from "../application";
import vertex from './vertex.glsl';


const geometry = new Geometry()
  .addAttribute('aVertexPosition', [-100, -50, 100, -50, 0, 100]);

const shader = Shader.from(`

    precision mediump float;
    attribute vec2 aVertexPosition;

    uniform mat3 translationMatrix;
    uniform mat3 projectionMatrix;

    void main() {
        gl_Position = vec4((projectionMatrix * translationMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);
    }`,

  `precision mediump float;

    void main() {
        gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
    }

`);

const triangle = new Mesh(geometry, shader);

triangle.position.set(400, 300);

app.stage.addChild(triangle);

app.ticker.add((delta) => {
  triangle.rotation += 0.01;
});

precision mediump float;

uniform vec2 iResolution;

void main() {
    vec2 uv = gl_FragCoord.xy / iResolution / 2.0;
    gl_FragColor = vec4(uv, 1.0, 1.0);
}

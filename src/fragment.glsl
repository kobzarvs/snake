precision mediump float;

uniform vec2 iResolution;
uniform float iTime;

void main() {
    vec2 st = gl_FragCoord.xy/iResolution.xy*.5;
    float i = mod(iTime / 10.0, 1.0) + st.y / 5.0;
//    if (st.x >= 0.0 && st.x <= 1.0) {
//        gl_FragColor = vec4(1.0);
//    } else {
//        gl_FragColor = vec4(0.0, 1.0, 0.0, 0.5);
//    }
    gl_FragColor = vec4(0.0, 1.0, 0.0, 1.0);

}

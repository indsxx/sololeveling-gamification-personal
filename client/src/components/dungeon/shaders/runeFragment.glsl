// runeFragment.glsl
uniform float uTime;
uniform vec3 uColor;
varying vec2 vUv;

void main() {
  vec2 uv = vUv + vec2(0.0, uTime * 0.1);
  float glow = sin(uv.y * 10.0 + uTime) * 0.5 + 0.5;
  glow *= smoothstep(0.3, 0.7, glow);
  vec3 color = uColor * glow;
  float alpha = glow * 0.8;
  gl_FragColor = vec4(color, alpha);
}

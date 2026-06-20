// crystalFragment.glsl
uniform float uTime;
uniform vec3 uColor;
varying vec3 vNormal;
varying vec3 vViewPosition;

void main() {
  vec3 viewDir = normalize(vViewPosition);
  float fresnel = pow(1.0 - abs(dot(viewDir, vNormal)), 3.0);
  float pulse = sin(uTime * 2.0) * 0.1 + 0.9;
  vec3 color = uColor * pulse + fresnel * vec3(1.0) * 0.5;
  float alpha = 0.7 + fresnel * 0.3;
  gl_FragColor = vec4(color, alpha);
}

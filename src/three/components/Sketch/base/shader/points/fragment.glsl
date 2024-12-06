#include './includes/common.glsl'

varying vec4 pointsData;
varying float vNowTime;
varying float alpha;

uniform sampler2D diffuse;
uniform float dir;

void main() {
  vec2 uv = pointsData.xy;

  uv = rotate(uv - .5, -(pointsData.z + vNowTime) * dir) + .5;
  uv = vec2((uv.x + floor(pointsData.w * 5.)) / 5., uv.y);

  vec4 color = texture2D(diffuse, uv);
  gl_FragColor = color;
  gl_FragColor.a *= alpha;
}
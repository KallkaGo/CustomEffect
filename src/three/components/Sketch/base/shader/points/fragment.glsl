#include './includes/common.glsl'

varying vec4 pointsData;
varying float vNowTime;
varying float alpha;
varying float vtest;

uniform sampler2D diffuse;

vec2 fun1(vec2 param1, float param2) {
  float param5 = sin(param2);
  float param4 = cos(param2);
  float param7 = param5 * -1.;
  mat2 param8 = mat2(param4, param7, param5, param4);
  vec2 param10 = param8 * param1;
  return param10;
}

void main() {
  vec2 uv = pointsData.xy;

  uv = rotate(uv - .5, pointsData.z + vNowTime) + .5;
  uv = vec2((uv.x + floor(pointsData.w * 5.)) / 5., uv.y);

  vec4 color = texture2D(diffuse, uv);
  gl_FragColor = color;
  gl_FragColor.a *= alpha;
}
float inverseLerp(float v, float minValue, float maxValue) {
  return (v - minValue) / (maxValue - minValue);
}

float remap(float v, float inMin, float inMax, float outMin, float outMax) {
  float t = inverseLerp(v, inMin, inMax);
  return mix(outMin, outMax, t);
}

vec3 backgroundColor(vec2 uv) {
  float disFromCenter = length(abs(uv - 0.5));

  float vignette = 1. - disFromCenter;

  vignette = smoothstep(0., .7, vignette);

  vignette = remap(vignette, 0., 1., 0.3, 1.);

  return vec3(vignette);
}

vec3 drawGrid(vec3 color, vec3 lineColor, float cellSpacing, float lineWidth,vec2 uv) {
  vec2 center = uv - .5;
  vec2 cells = abs(fract(center * resolution / cellSpacing) - 0.5);
  float disToEdge = (0.5 - max(cells.x, cells.y)) * cellSpacing;
  float lines = smoothstep(0., lineWidth, disToEdge);

  color = mix(lineColor, color, lines);

  return color;
  
}

void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {

  vec3 bgColor = backgroundColor(uv);
  bgColor = drawGrid(bgColor, vec3(0.4), 10., 1., uv);
  bgColor = drawGrid(bgColor, vec3(0.0), 100., 2., uv);

  outputColor = vec4(bgColor, 1.0);

}
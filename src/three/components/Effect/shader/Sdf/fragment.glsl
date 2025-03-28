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

vec3 drawGrid(vec3 color, vec3 lineColor, float cellSpacing, float lineWidth, vec2 uv) {
  vec2 center = uv - .5;
  vec2 cells = abs(fract(center * resolution / cellSpacing) - 0.5);
  float disToEdge = (0.5 - max(cells.x, cells.y)) * cellSpacing;
  float lines = smoothstep(0., lineWidth, disToEdge);

  color = mix(lineColor, color, lines);

  return color;

}

float sdfCircle(vec2 p, float r) {
  return length(p) - r;
}

float sdfLine(vec2 p, vec2 a, vec2 b) {
  vec2 pa = p - a;
  vec2 ba = b - a;
  float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
  return length(pa - ba * h);
}

float sdfBox(vec2 p, vec2 s) {
  vec2 d = abs(p) - s;
  return length(max(d, 0.0)) + min(max(d.x, d.y), 0.0);
}

// Inigo Quilez 
// https://iquilezles.org/articles/distfunctions2d/
float sdHexagram(in vec2 p, in float r) {
  const vec4 k = vec4(-0.5, 0.8660254038, 0.5773502692, 1.7320508076);
  p = abs(p);
  p -= 2.0 * min(dot(k.xy, p), 0.0) * k.xy;
  p -= 2.0 * min(dot(k.yx, p), 0.0) * k.yx;
  p -= vec2(clamp(p.x, r * k.z, r * k.w), r);
  return length(p) * sign(p.y);
}

float opUnion(float d1, float d2) {
  return min(d1, d2);
}

float opSubtraction(float d1, float d2) {
  return max(-d1, d2);
}

float opIntersection(float d1, float d2) {
  return max(d1, d2);
}

// https://zh.wikipedia.org/wiki/LogSumExp
float softMax(float a, float b, float k) {
  return log(exp(k * a) + exp(k * b)) / k;
}

float softMin(float a, float b, float k) {
  return -softMax(-a, -b, k);
}

float softMinValue(float a, float b, float k) {
  float h = exp(-b * k) / (exp(-a * k) + exp(-b * k));
  // float h = remap(a - b, -1.0 / k, 1.0 / k, 0.0, 1.0);
  return h;
}

const vec3 RED = vec3(1.0, 0.1, 0.1);
const vec3 BLUE = vec3(0.1, 0.1, 1.0);

mat2 rotate2D(float angle) {
  float s = sin(angle);
  float c = cos(angle);
  return mat2(c, s, -s, c);
}

void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {

  vec2 pixelCoord = (uv - .5) * resolution;

  vec3 color = backgroundColor(uv);
  color = drawGrid(color, vec3(0.4), 10., 1., uv);
  color = drawGrid(color, vec3(0.0), 100., 2., uv);

  // float d = sdfCircle(pixelCoord, 100.);

  /* base to games101 first translate second rotate   */
  // vec2 bPos = pixelCoord - vec2(300., 300.);

  // bPos *= rotate2D(time * .25);

  // float t = sdfLine(pixelCoord, vec2(-200., -100.), vec2(300., -200.));

  // float b = sdfBox(bPos, vec2(300., 100.));

  // float s = sdHexagram(pixelCoord - vec2(-300., 300.), 100.);

  // color = mix(RED * 0.2, color, smoothstep(-1., 1., d));
  // color = mix(RED, color, smoothstep(-5., 0., d));

  // color = mix(RED, color, smoothstep(4., 6., t));

  // color = mix(RED * 0.2, color, smoothstep(-1., 1., b));
  // color = mix(RED, color, smoothstep(-5., 0., b));

  // color = mix(RED * 0.2, color, smoothstep(-1., 1., s));
  // color = mix(RED, color, smoothstep(-5., 0., s));

  float box = sdfBox(rotate2D(time * 0.5) * pixelCoord, vec2(200.0, 100.0));
  float d1 = sdHexagram(pixelCoord - vec2(-300.0, -150.0), 70.0);
  float d2 = sdHexagram(pixelCoord - vec2(300.0, -150.0), 70.0);
  float d3 = sdHexagram(pixelCoord - vec2(0.0, 300.0), 70.0);
  float d = opUnion(opUnion(d1, d2), d3);

  vec3 sdfColour = mix(RED, BLUE, smoothstep(0.0, 1.0, softMinValue(box, d, 0.01)));

  d = softMin(box, d, .05);
  color = mix(sdfColour * 0.2, color, smoothstep(-1.0, 1.0, d));
  color = mix(sdfColour, color, smoothstep(-5.0, 0.0, d));

  outputColor = vec4(color, 1.0);

}
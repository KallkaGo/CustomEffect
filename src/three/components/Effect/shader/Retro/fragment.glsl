precision highp float;

uniform float uColorNum;
uniform float uPixelSize;
uniform float uMaskIntensity;
uniform float uCurveIntensity;
uniform vec2 uResolution;

const float bayerMatrix8x8[64] = float[64](0.0 / 64.0, 48.0 / 64.0, 12.0 / 64.0, 60.0 / 64.0, 3.0 / 64.0, 51.0 / 64.0, 15.0 / 64.0, 63.0 / 64.0, 32.0 / 64.0, 16.0 / 64.0, 44.0 / 64.0, 28.0 / 64.0, 35.0 / 64.0, 19.0 / 64.0, 47.0 / 64.0, 31.0 / 64.0, 8.0 / 64.0, 56.0 / 64.0, 4.0 / 64.0, 52.0 / 64.0, 11.0 / 64.0, 59.0 / 64.0, 7.0 / 64.0, 55.0 / 64.0, 40.0 / 64.0, 24.0 / 64.0, 36.0 / 64.0, 20.0 / 64.0, 43.0 / 64.0, 27.0 / 64.0, 39.0 / 64.0, 23.0 / 64.0, 2.0 / 64.0, 50.0 / 64.0, 14.0 / 64.0, 62.0 / 64.0, 1.0 / 64.0, 49.0 / 64.0, 13.0 / 64.0, 61.0 / 64.0, 34.0 / 64.0, 18.0 / 64.0, 46.0 / 64.0, 30.0 / 64.0, 33.0 / 64.0, 17.0 / 64.0, 45.0 / 64.0, 29.0 / 64.0, 10.0 / 64.0, 58.0 / 64.0, 6.0 / 64.0, 54.0 / 64.0, 9.0 / 64.0, 57.0 / 64.0, 5.0 / 64.0, 53.0 / 64.0, 42.0 / 64.0, 26.0 / 64.0, 38.0 / 64.0, 22.0 / 64.0, 41.0 / 64.0, 25.0 / 64.0, 37.0 / 64.0, 21.0 / 64.0);

float random(vec2 c) {
  return fract(sin(dot(c.xy, vec2(12.9898, 78.233))) * 43758.5453);
}

// 2D Noise based on Morgan McGuire @morgan3d
// https://www.shadertoy.com/view/4dS3Wd
float noise(in vec2 st) {
  vec2 i = floor(st);
  vec2 f = fract(st);

  float a = random(i);
  float b = random(i + vec2(1.0, 0.0));
  float c = random(i + vec2(0.0, 1.0));
  float d = random(i + vec2(1.0, 1.0));

  vec2 u = f * f * (3.0 - 2.0 * f);

  return mix(a, b, u.x) +
    (c - a) * u.y * (1.0 - u.x) +
    (d - b) * u.x * u.y;
}

vec3 dither(vec2 uv, vec3 color, float colorNum) {
  int x = int(uv.x * resolution.x) % 8;
  int y = int(uv.y * resolution.y) % 8;
  float threshold = bayerMatrix8x8[y * 8 + x];

  color.rgb += threshold * 0.6;
  color.r = floor(color.r * (colorNum - 1.0) + 0.5) / (colorNum - 1.0);
  color.g = floor(color.g * (colorNum - 1.0) + 0.5) / (colorNum - 1.0);
  color.b = floor(color.b * (colorNum - 1.0) + 0.5) / (colorNum - 1.0);

  return color;
}

const float MASK_BORDER = .9;
const float SPREAD = 0.0005;
void mainUv(inout vec2 uv) {
  float shake = (noise(vec2(uv.y) * sin(time * 400.0) * 100.0) - 0.5) * 0.0025;
  uv.x += shake * .08;
}

void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
  // resolution是根据Canvas的大小来赋值的 即会产生全屏的效果 和滑块冲突
  vec2 newUV = gl_FragCoord.xy / uResolution;
  vec2 curveUV = newUV * 2.0 - 1.0;
  vec2 offset = curveUV.yx * uCurveIntensity;
  curveUV += curveUV * offset * offset;
  curveUV = curveUV * 0.5 + 0.5;

  float scanlineY = 1. - mod(time * .1, 1.);

  float lineThickness = .005;

  float distanceToLine = abs(uv.y - scanlineY);

  vec3 lineColor = inputColor.rgb * .8;

  float lineAlpha = smoothstep(0., lineThickness, lineThickness - distanceToLine);

  vec2 pixel = uv * resolution;
  vec2 coord = pixel / uPixelSize;
  vec2 subcoord = coord * vec2(3, 1);
  vec2 cellOffset = vec2(0, mod(floor(coord.x), 3.0) * 0.5);

  float ind = mod(floor(subcoord.x), 3.0);
  vec3 maskColor = vec3(ind == 0.0, ind == 1.0, ind == 2.0) * 2.0;

  vec2 cellUv = fract(subcoord + cellOffset) * 2.0 - 1.0;
  // 边缘获得较高的值 中心的值较低
  vec2 border = 1.0 - cellUv * cellUv * MASK_BORDER;
  maskColor.rgb *= border.x * border.y;

  // 计算每个片元在 RGB 子像素网格 中的 UV 坐标，并将其映射回全局 UV 坐标空间
  vec2 rgbCellUV = floor(coord + cellOffset) * uPixelSize / resolution;

  vec4 color = vec4(1.0);
  color.r = texture2D(inputBuffer, rgbCellUV + SPREAD).r;
  color.g = texture2D(inputBuffer, rgbCellUV).g;
  color.b = texture2D(inputBuffer, rgbCellUV - SPREAD).b;
  color.rgb = dither(rgbCellUV, color.rgb, uColorNum);

  color.rgb *= 1.0 + (maskColor - 1.0) * uMaskIntensity;

  vec2 edge = smoothstep(0., 0.02, curveUV) * (1. - smoothstep(1. - 0.02, 1., curveUV));
  color.rgb = mix(color.rgb, lineColor, lineAlpha);
  color.rgb *= edge.x * edge.y;

  outputColor = color;
}
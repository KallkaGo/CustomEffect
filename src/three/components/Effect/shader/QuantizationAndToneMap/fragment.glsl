uniform sampler2D uTex;
uniform float uAdjustment;
uniform int uColorSum;

vec3 ACESFilm(vec3 x) {
  float a = 2.51;
  float b = 0.03;
  float c = 2.43;
  float d = 0.59;
  float e = 0.14;
  return clamp((x * (a * x + b)) / (x * (c * x + d) + e), 0.0, 1.0);
}

vec3 saturating(vec3 rgb, float adjustment) {
  vec3 W = vec3(0.2125, 0.7154, 0.0721); // Luminance weights
  vec3 intensity = vec3(dot(rgb, W));
  return mix(intensity, rgb, adjustment);
}

void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
  vec3 color = inputColor.rgb;
  vec4 roughnessTex = texture2D(uTex, uv);
  vec3 grayscale = vec3(dot(color, vec3(0.299, 0.587, 0.114)));
  // color quantization
  int n = 16;
  float x = grayscale.r;
  float qn = floor(x * float(n - 1) + 0.5) / float(n - 1);
  qn = clamp(qn, 0.2, 0.7);

  if(qn < 0.5) {
    color = mix(vec3(0.1), color.rgb, qn * 2.0);
  } else {
    color = mix(color.rgb, vec3(1.0), (qn - 0.5) * 2.0);
  }

  color = saturating(color, uAdjustment);
  color = ACESFilm(color);
  vec4 finalColor = vec4(color, 1.0);
  finalColor *= roughnessTex;

  outputColor = finalColor;
}
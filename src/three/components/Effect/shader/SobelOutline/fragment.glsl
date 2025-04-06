uniform sampler2D uDepthTexture;
uniform sampler2D uNormalTexture;

uniform float uThickness;
uniform float uOutLineDepthMul;
uniform float uOutLineDepthBias;
uniform float uOutLineNormalMul;
uniform float uOutLineNormalBias;

float Linear01Depth(float depth) {
  float x = 1. - cameraFar / cameraNear;
  float y = cameraFar / cameraNear;
  float z = x / cameraFar;
  float w = y / cameraFar;
  return 1.0 / (x * depth + y);
}

float LinnearEyeDepth(float depth) {
  float x = 1. - cameraFar / cameraNear;
  float y = cameraFar / cameraNear;
  float z = x / cameraFar;
  float w = y / cameraFar;
  return 1.0 / (z * depth + w);
}

float SobelSampleDepth(sampler2D s, vec2 uv, vec3 offset) {
  float pixelCenter = LinnearEyeDepth(texture2D(s, uv).r);
  float pixelLeft = LinnearEyeDepth(texture2D(s, uv - offset.xz).r);
  float pixelRight = LinnearEyeDepth(texture2D(s, uv + offset.xz).r);
  float pixelUp = LinnearEyeDepth(texture2D(s, uv + offset.zy).r);
  float pixelDown = LinnearEyeDepth(texture2D(s, uv - offset.zy).r);

  return abs(pixelLeft - pixelCenter) +
    abs(pixelRight - pixelCenter) +
    abs(pixelUp - pixelCenter) +
    abs(pixelDown - pixelCenter);
}

vec4 SobelSample(sampler2D t, vec2 uv, vec3 offset) {
  vec4 pixelCenter = texture2D(t, uv);
  vec4 pixelLeft = texture2D(t, uv - offset.xz);
  vec4 pixelRight = texture2D(t, uv + offset.xz);
  vec4 pixelUp = texture2D(t, uv + offset.zy);
  vec4 pixelDown = texture2D(t, uv - offset.zy);

  return abs(pixelLeft - pixelCenter) +
    abs(pixelRight - pixelCenter) +
    abs(pixelUp - pixelCenter) +
    abs(pixelDown - pixelCenter);
}

void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {

  vec4 outlineColor = vec4(0.0, 0.0, 0.0, 1.0);

  vec3 texel = vec3(1. / resolution.x, 1. / resolution.y, 0.0) * uThickness;

  float sobelDepth = SobelSampleDepth(uDepthTexture, uv, texel);

  sobelDepth = pow(abs(clamp(sobelDepth * uOutLineDepthMul, 0.0, 1.0)), uOutLineDepthBias);

  vec3 sobelNormalVec = abs(SobelSample(uNormalTexture, uv, texel).rgb);

  float sobelNormal = sobelNormalVec.r + sobelNormalVec.g + sobelNormalVec.b;

  sobelNormal = pow(abs(sobelNormal * uOutLineNormalMul), uOutLineNormalBias);

  float sobelOutline = clamp(max(sobelDepth, sobelNormal), 0., 1.);

  sobelOutline = smoothstep(0.1, 1., sobelOutline);

  vec4 finalColor = mix(inputColor, outlineColor, sobelOutline);

  outputColor = finalColor;

}
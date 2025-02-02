#include '../../includes/tools.glsl

uniform sampler2D uDiffuse;
uniform float uSaturationAmount;
uniform float uContrastAmount;
uniform float uVignetteAmount;
uniform vec3 uRefColor;
uniform float uDimension;
uniform vec2 uImageSize;

float inverseLerp(float v, float minValue, float maxValue) {
  return (v - minValue) / (maxValue - minValue);
}

float remap(float v, float inMin, float inMax, float outMin, float outMax) {
  float t = inverseLerp(v, inMin, inMax);
  return mix(outMin, outMax, t);
}

void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {

  vec2 newUV = calcCoord(uv,uImageSize, resolution);

  vec2 coord = fract(newUV * vec2(2.0, 1.0));

  coord.x = remap(coord.x, 0., 1., 0.15, 0.85);

  vec3 color = texture2D(uDiffuse, coord).rgb;

  float luminance = dot(color, vec3(0.2126, 0.7152, 0.0722));

  if(uv.x > 0.5) {
    #ifdef MODE_SATURATION

    float saturationAmount = uSaturationAmount;
    color = mix(vec3(luminance), color, saturationAmount);

    #endif

    #ifdef MODE_CONTRAST
    float contrastAmount = uContrastAmount;
    float midpoint = 0.5;

    vec3 sg = sign(color - midpoint);
    color = sg * pow(abs(color - midpoint) * 2.0, vec3(1.0 / contrastAmount)) * 0.5 + midpoint;

    #endif

    #ifdef MODE_COLORBOOST
    vec3 refColor = uRefColor;

    float colorWeight = dot(normalize(color), normalize(refColor));
    colorWeight = pow(colorWeight, 32.0);
    color = mix(vec3(luminance), color, colorWeight);

    #endif

    #ifdef MODE_VIGNETTE

    vec2 vignetteCoords = fract(uv * vec2(2.0, 1.0));

    float v1 = smoothstep(0.5, 0.2, abs(vignetteCoords.x - 0.5));
    float v2 = smoothstep(0.5, 0.2, abs(vignetteCoords.y - 0.5));
    float vignetteAmount = v1 * v2;
    vignetteAmount = pow(vignetteAmount, uVignetteAmount);
    vignetteAmount = remap(vignetteAmount, 0.0, 1.0, 0.5, 1.0);

    color *= vignetteAmount;

    #endif

    #ifdef MODE_PIXELATION

    vec2 dims = vec2(uDimension);
    vec2 pixelCoords = floor(coord * dims) / dims;
    vec3 pixelColor = texture2D(uDiffuse, pixelCoords).rgb;
    color = pixelColor;

    #endif

    #ifdef MODE_DISTORTION

    float dis = length(coord - 0.5);

    float intensity = sin(dis * 50.0 - time *.5);

    vec2 dir = normalize(coord - 0.5);

    coord = coord + dir * intensity * .05;

    vec3 disortionTex = texture2D(uDiffuse, coord).rgb;

    color = disortionTex;

    #endif

  }

  outputColor = vec4(color, 1.);

}
#include '../includes/includes.glsl'

uniform sampler2D uCurrentTexture;
uniform sampler2D uNextTexture;
uniform float uProgress;
uniform vec2 uImageSize;
uniform float uIntensity;

void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
  float intensity = uIntensity;
  vec2 newUV = calcCoord(uv, uImageSize, resolution);
  // newUV = uv;
  vec4 curDiffuse = texture2D(uCurrentTexture, newUV);
  vec4 nextDiffuse = texture2D(uNextTexture, newUV);
  // maybe .125 or .129 ?
  float displace1 = (curDiffuse.r + curDiffuse.g + curDiffuse.b) * 0.134;
  float displace2 = (nextDiffuse.r + nextDiffuse.g + nextDiffuse.b) * 0.134;
  vec4 t1 = texture2D(uCurrentTexture, vec2(newUV.x + uProgress * (displace2 * intensity), newUV.y));
  vec4 t2 = texture2D(uNextTexture, vec2(newUV.x + -(1.0 - uProgress) * (displace1 * intensity), newUV.y));
  outputColor = mix(t1, t2, uProgress);
}
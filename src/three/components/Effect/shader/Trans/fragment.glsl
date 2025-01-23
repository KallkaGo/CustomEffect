uniform sampler2D uCurrentTexture;
uniform sampler2D uNextTexture;
uniform float uProgress;
uniform vec2 uScreenSize;
uniform vec2 uImageSize;
uniform float uIntensity;

//css object-fit: cover implement
vec2 calcCoord(in vec2 coord) {
  vec2 textureImageSize = uImageSize;
  vec2 screenSize = uScreenSize;
  float rs = screenSize.x / screenSize.y;
  float ri = textureImageSize.x / textureImageSize.y;
  vec2 new = rs < ri ? vec2(textureImageSize.x * screenSize.y / textureImageSize.y, screenSize.y) : vec2(screenSize.x, textureImageSize.y * screenSize.x / textureImageSize.x);
  vec2 offset = (rs < ri ? vec2((new.x - screenSize.x) / 2.0, 0.0) : vec2(0.0, (new.y - screenSize.y) / 2.0)) / new;
  vec2 uv = coord * screenSize / new + offset;
  return uv;
}

void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
  float intensity = uIntensity;
  vec2 newUV = calcCoord(uv);
  // newUV = uv;
  vec4 curDiffuse = texture2D(uCurrentTexture, newUV);
  vec4 nextDiffuse = texture2D(uNextTexture, newUV);
  // maybe .125 or .129 ?
  float displace1 = (curDiffuse.r + curDiffuse.g + curDiffuse.b) * 0.128;
  float displace2 = (nextDiffuse.r + nextDiffuse.g + nextDiffuse.b) * 0.128;
  vec4 t1 = texture2D(uCurrentTexture, vec2(newUV.x + uProgress * (displace2 * intensity), newUV.y));
  vec4 t2 = texture2D(uNextTexture, vec2(newUV.x + -(1.0 - uProgress) * (displace1 * intensity), newUV.y));
  outputColor = mix(t1, t2, uProgress);
}
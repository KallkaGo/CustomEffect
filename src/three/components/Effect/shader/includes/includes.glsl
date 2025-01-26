//css object-fit: cover implement
vec2 calcCoord(in vec2 coord,in vec2 imageSize,in vec2 resolution) {
  vec2 textureImageSize = imageSize;
  vec2 screenSize = resolution;
  float rs = screenSize.x / screenSize.y;
  float ri = textureImageSize.x / textureImageSize.y;
  vec2 new = rs < ri ? vec2(textureImageSize.x * screenSize.y / textureImageSize.y, screenSize.y) : vec2(screenSize.x, textureImageSize.y * screenSize.x / textureImageSize.x);
  vec2 offset = (rs < ri ? vec2((new.x - screenSize.x) / 2.0, 0.0) : vec2(0.0, (new.y - screenSize.y) / 2.0)) / new;
  vec2 uv = coord * screenSize / new + offset;
  return uv;
}
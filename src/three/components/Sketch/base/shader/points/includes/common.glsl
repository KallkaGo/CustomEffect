vec2 rotate(vec2 pos, float angle) {
  float s = sin(angle);
  float c = cos(angle);
  mat2 rotateMatrix = mat2(c, s, -s, c);
  return rotateMatrix * pos;
}
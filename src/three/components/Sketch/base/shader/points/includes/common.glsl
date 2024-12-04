vec2 rotate(vec2 pos, float angle) {
  float s = sin(angle);
  float c = cos(angle);
  mat2 rotateMatrix = mat2(c, s, -s, c);
  return rotateMatrix * pos;
}

float inverseLerp(float v, float minValue, float maxValue) {
  return (v - minValue) / (maxValue - minValue);
}

float remap(float v, float inMin, float inMax, float outMin, float outMax) {
  float t = inverseLerp(v, inMin, inMax);
  return mix(outMin, outMax, t);
}
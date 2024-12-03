vec2 fun1(vec2 param1, float param2) {
  float param5 = sin(param2);
  float param4 = cos(param2);
  float param7 = param5 * -1.;
  mat2 param8 = mat2(param4, param7, param5, param4);
  vec2 param10 = param8 * param1;
  return param10;
}
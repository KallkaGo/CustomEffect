#include '../includes/ditherFunction.glsl'

uniform vec2 uResulution;
uniform float uFactor;

void main() {
  vec2 pos = gl_FragCoord.xy / uResulution;
  ditherClip(pos, uFactor, uResulution);
}
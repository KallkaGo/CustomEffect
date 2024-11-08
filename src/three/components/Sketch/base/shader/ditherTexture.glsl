#include '../includes/ditherFunction.glsl'

uniform vec2 uResulution;
uniform float uFactor;
uniform sampler2D uTexture;

void main() {
  vec2 pos = gl_FragCoord.xy / uResulution;
  ditherClip(pos, uFactor, uTexture, 15., uResulution);
}
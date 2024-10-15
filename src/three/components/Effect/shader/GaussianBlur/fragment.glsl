varying vec2 vUv;
uniform sampler2D tDiffuse;
uniform bool uHorizontal;
uniform vec2 uResolution;

float weight[5] = float[](0.227027, 0.1945946, 0.1216216, 0.054054, 0.016216);

void main() {
  vec2 texelSize = 1.0 / uResolution;
  vec2 uv = vUv;
  vec4 sum = texture2D(tDiffuse, uv) * weight[0];

  if(uHorizontal) {
    for(int i = 1; i < 5; i++) {
      sum += texture2D(tDiffuse, uv + vec2(texelSize.x * float(i), 0.0)) * weight[abs(i)];
      sum += texture2D(tDiffuse, uv - vec2(texelSize.x * float(i), 0.0)) * weight[abs(i)];

    }
  } else {
    for(int i = 1; i < 5; i++) {
      sum += texture2D(tDiffuse, uv + vec2(0.0, texelSize.y * float(i))) * weight[abs(i)];
      sum += texture2D(tDiffuse, uv - vec2(0.0, texelSize.y * float(i))) * weight[abs(i)];
    }
  }

  gl_FragColor = vec4(sum.rgb, 1.0);

}
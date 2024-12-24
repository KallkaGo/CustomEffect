/* 
  Reference: 
  https://lisyarus.github.io/blog/posts/blur-coefficients-generator.html
  https://learnopengl.com/Advanced-Lighting/Bloom
 */

varying vec2 vUv;
uniform sampler2D tDiffuse;
uniform bool uHorizontal;
uniform vec2 uResolution;

// float weight[5] = float[](0.227027, 0.1945946, 0.1216216, 0.054054, 0.016216);

// const int SAMPLE_COUNT = 6;

// const float OFFSETS[6] = float[6](
//     -4.378621204796657,
//     -2.431625915613778,
//     -0.4862426846689485,
//     1.4588111840004858,
//     3.4048471718931532,
//     5.
// );

// const float WEIGHTS[6] = float[6](
//     0.09461172151436463,
//     0.20023097066826712,
//     0.2760751120037518,
//     0.24804559825032563,
//     0.14521459357563646,
//     0.035822003987654526
// );

const int SAMPLE_COUNT = 6;

const float OFFSETS[6] = float[6](
    -4.378621204796657,
    -2.431625915613778,
    -0.4862426846689485,
    1.4588111840004858,
    3.4048471718931532,
    5.
);

const float WEIGHTS[6] = float[6](
    0.09461172151436463,
    0.20023097066826712,
    0.2760751120037518,
    0.24804559825032563,
    0.14521459357563646,
    0.035822003987654526
);

vec4 blur(in sampler2D sourceTexture, vec2 blurDirection, vec2 pixelCoord,vec2 size)
{
    vec4 result = vec4(0.0);
    for (int i = 0; i < SAMPLE_COUNT; ++i)
    {
        vec2 offset = blurDirection * OFFSETS[i] / size;
        float weight = WEIGHTS[i];
        result += texture2D(sourceTexture, pixelCoord + offset) * weight;
    }
    return result;
}

void main() {
  vec2 texelSize = 1.0 / uResolution;
  vec2 uv = vUv;
  // vec4 sum = texture2D(tDiffuse, uv) * weight[0];

  // if(uHorizontal) {
  //   for(int i = 1; i < 5; i++) {
  //     sum += texture2D(tDiffuse, uv + vec2(texelSize.x * float(i), 0.0)) * weight[abs(i)];
  //     sum += texture2D(tDiffuse, uv - vec2(texelSize.x * float(i), 0.0)) * weight[abs(i)];

  //   }
  // } else {
  //   for(int i = 1; i < 5; i++) {
  //     sum += texture2D(tDiffuse, uv + vec2(0.0, texelSize.y * float(i))) * weight[abs(i)];
  //     sum += texture2D(tDiffuse, uv - vec2(0.0, texelSize.y * float(i))) * weight[abs(i)];
  //   }
  // }

  vec4 sum = vec4(0.0);
  vec2 direction = vec2(0.);

  if(uHorizontal) {
    direction = vec2(1.,0.);
    sum +=blur(tDiffuse,direction,uv,uResolution);
  }
  else {
    direction = vec2(0.,1.);
    sum +=blur(tDiffuse,direction,uv,uResolution);
  }

  gl_FragColor = vec4(sum.rgb, 1.0);

}
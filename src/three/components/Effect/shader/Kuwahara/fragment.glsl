uniform int uRadius;

#define SECTOR_COUNT 8

#define _PI 3.14159

const float perAngle = 2.0 * _PI / float(SECTOR_COUNT);

vec3 sampleColor(vec2 offset) {
  vec2 coord = (gl_FragCoord.xy + offset) / resolution.xy;
  return texture2D(inputBuffer, coord).rgb;
}
// https://www.umsl.edu/~kangh/Papers/kang-tpcg2010.pdf
float polynomialWeight(float x, float y, float eta, float lambda) {
  float polyValue = (x + eta) - lambda * (y * y);
  return max(0.0, polyValue * polyValue);
}

void getSectorVarianceAndAverageColor(float angle, float radius, out vec3 avgColor, out float variance) {
  vec3 colorSum = vec3(0.0);
  vec3 squaredColorSum = vec3(0.0);
  float totalWeight = 0.0;
  float eta = 0.1;
  float lambda = 0.5;

  for(float r = 1.0; r <= radius; r += 1.0) {
    // -8/π to 8/π
    for(float a = -perAngle * .5; a <= perAngle * .5; a += 0.196349) {
      vec2 sampleOffset = r * vec2(cos(angle + a), sin(angle + a));
      vec3 color = sampleColor(sampleOffset);
      float weight = polynomialWeight(sampleOffset.x, sampleOffset.y, eta, lambda);
      colorSum += color * weight;
      squaredColorSum += color * color * weight;
      totalWeight += weight;
    }
  }
  // μ = (1/n) * Σ(xi)
  avgColor = colorSum / totalWeight;
  // σ² = (1/n) * Σ((xi - μ)²) = (1/n) * Σ(xi²) - (1/n) * Σ(xi)² Derivation:https://www.yuque.com/u33646201/wh3mt6/abzffwzqynfcb5gm#pUlKF
  vec3 varianceRes = (squaredColorSum / totalWeight) - (avgColor * avgColor);
  variance = dot(varianceRes, vec3(0.299, 0.587, 0.114));
}

void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {

  vec3 sectorAvgColors[SECTOR_COUNT];
  float sectorVariances[SECTOR_COUNT];

  for(int i = 0; i < SECTOR_COUNT; i++) {
    float angle = float(i) * 2. * _PI / float(SECTOR_COUNT);
    getSectorVarianceAndAverageColor(angle, float(uRadius), sectorAvgColors[i], sectorVariances[i]);
  }

  float minVariance = sectorVariances[0];
  vec3 finalColor = sectorAvgColors[0];

  for(int i = 1; i < SECTOR_COUNT; i++) {
    if(sectorVariances[i] < minVariance) {
      minVariance = sectorVariances[i];
      finalColor = sectorAvgColors[i];
    }
  }
  outputColor = vec4(finalColor, 1.0);
}
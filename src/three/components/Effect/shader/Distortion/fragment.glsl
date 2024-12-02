uniform sampler2D uDiffuse;
uniform vec2 uCenter;
uniform float uPorgress;
uniform vec3 uHighLight;

void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
  vec4 diffuse = texture2D(uDiffuse, uv);

  vec3 baseColor = vec3(0.);

  float edge = .4;

  #ifdef BLEND_WITH_DIFFUSE

  edge = .3;

  baseColor = diffuse.rgb;

  #endif

  vec2 scale = vec2(1., resolution.y / resolution.x);

  vec2 uv2 = uv;

  vec2 newUV = (uv - .5) * scale + .5;

  float dist = distance(newUV, uCenter);

  float progress = uPorgress;

  float minProgress = max(0., progress - .2);
  float maxProgress = progress + .2;

  // If progres is not judged, the denominator will be 0
  if(progress > 0. && dist <= maxProgress && dist >= minProgress) {
    float diff = dist - progress;
    // pow(|5x|,0.4) when x = 0.2  result is 1
    float scaleDiff = max(0., 1. - pow(abs(diff * 5.), .4));

    float diffTime = diff * scaleDiff;

    vec2 diffuv = (normalize(uv - uCenter) - .5) * scale + .5;

    uv2 += diffuv * diffTime / (progress * dist * 30.0) * smoothstep(0.0, .5, dist);

    diffuse = texture2D(uDiffuse, uv2);

    diffuse.rgb += uHighLight * scaleDiff / (progress * dist * 30.0);
  }

  outputColor = vec4(diffuse.rgb, 1.0);
  outputColor.rgb = mix(baseColor.rgb, diffuse.rgb, smoothstep(0., edge, progress));
}
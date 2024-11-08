float isDithered(vec2 pos, float alpha, vec2 resolution) {

  pos *= resolution;

  float bayerMatrix8x8[64] = float[64](0.0 / 64.0, 48.0 / 64.0, 12.0 / 64.0, 60.0 / 64.0, 3.0 / 64.0, 51.0 / 64.0, 15.0 / 64.0, 63.0 / 64.0, 32.0 / 64.0, 16.0 / 64.0, 44.0 / 64.0, 28.0 / 64.0, 35.0 / 64.0, 19.0 / 64.0, 47.0 / 64.0, 31.0 / 64.0, 8.0 / 64.0, 56.0 / 64.0, 4.0 / 64.0, 52.0 / 64.0, 11.0 / 64.0, 59.0 / 64.0, 7.0 / 64.0, 55.0 / 64.0, 40.0 / 64.0, 24.0 / 64.0, 36.0 / 64.0, 20.0 / 64.0, 43.0 / 64.0, 27.0 / 64.0, 39.0 / 64.0, 23.0 / 64.0, 2.0 / 64.0, 50.0 / 64.0, 14.0 / 64.0, 62.0 / 64.0, 1.0 / 64.0, 49.0 / 64.0, 13.0 / 64.0, 61.0 / 64.0, 34.0 / 64.0, 18.0 / 64.0, 46.0 / 64.0, 30.0 / 64.0, 33.0 / 64.0, 17.0 / 64.0, 45.0 / 64.0, 29.0 / 64.0, 10.0 / 64.0, 58.0 / 64.0, 6.0 / 64.0, 54.0 / 64.0, 9.0 / 64.0, 57.0 / 64.0, 5.0 / 64.0, 53.0 / 64.0, 42.0 / 64.0, 26.0 / 64.0, 38.0 / 64.0, 22.0 / 64.0, 41.0 / 64.0, 25.0 / 64.0, 37.0 / 64.0, 21.0 / 64.0);

  int index = (int(pos.x) % 8) * 8 + int(pos.y) % 8;

  return alpha - bayerMatrix8x8[index];
}

float isDithered(vec2 pos, float alpha, sampler2D tex, float scale, vec2 resolution) {

  pos *= resolution;

  pos.x -= resolution.x / 2.;
  pos.y -= resolution.y / 2.;

  pos.x /= scale;
  pos.y /= scale;

	// ensure that we clip if the alpha is zero by
	// subtracting a small value when alpha == 0, because
	// the clip function only clips when < 0
  return alpha - texture2D(tex, pos.xy).r - 0.0001 * (1. - ceil(alpha));
}

void clip(float value) {
  if(value <= 0.0)
    discard;
}

void ditherClip(vec2 pos, float alpha, vec2 resolution) {
  clip(isDithered(pos, alpha, resolution));
}

void ditherClip(vec2 pos, float alpha, sampler2D tex, float scale, vec2 resolution) {
  clip(isDithered(pos, alpha, tex, scale, resolution));
}
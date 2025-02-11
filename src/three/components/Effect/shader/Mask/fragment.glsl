uniform sampler2D uChannel0;
uniform vec2 uMousePos;

float luminance(vec3 color) {
  return 0.2125 * color.r + 0.7154 * color.g + 0.0721 * color.b;
}

float sdfCircle(vec2 p, float r) {
  return length(p) - r;
}

// The MIT License
// Copyright © 2013 Inigo Quilez
// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions: The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software. THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
// https://www.youtube.com/c/InigoQuilez
// https://iquilezles.org/
//
// https://www.shadertoy.com/view/Xsl3Dl
vec3 hash( vec3 p ) // replace this by something better
{
	p = vec3( dot(p,vec3(127.1,311.7, 74.7)),
            dot(p,vec3(269.5,183.3,246.1)),
            dot(p,vec3(113.5,271.9,124.6)));

	return -1.0 + 2.0*fract(sin(p)*43758.5453123);
}

float noise( in vec3 p )
{
  vec3 i = floor( p );
  vec3 f = fract( p );
	
	vec3 u = f*f*(3.0-2.0*f);

  return mix( mix( mix( dot( hash( i + vec3(0.0,0.0,0.0) ), f - vec3(0.0,0.0,0.0) ), 
                        dot( hash( i + vec3(1.0,0.0,0.0) ), f - vec3(1.0,0.0,0.0) ), u.x),
                   mix( dot( hash( i + vec3(0.0,1.0,0.0) ), f - vec3(0.0,1.0,0.0) ), 
                        dot( hash( i + vec3(1.0,1.0,0.0) ), f - vec3(1.0,1.0,0.0) ), u.x), u.y),
              mix( mix( dot( hash( i + vec3(0.0,0.0,1.0) ), f - vec3(0.0,0.0,1.0) ), 
                        dot( hash( i + vec3(1.0,0.0,1.0) ), f - vec3(1.0,0.0,1.0) ), u.x),
                   mix( dot( hash( i + vec3(0.0,1.0,1.0) ), f - vec3(0.0,1.0,1.0) ), 
                        dot( hash( i + vec3(1.0,1.0,1.0) ), f - vec3(1.0,1.0,1.0) ), u.x), u.y), u.z );
}

float fbm(vec3 p, int octaves, float persistence, float lacunarity) {
  float amplitude = 1.0;
  float frequency = 1.0;
  float total = 0.0;
  float normalization = 0.0;

  for (int i = 0; i < octaves; ++i) {
    float noiseValue = noise(p * frequency);
    total += noiseValue * amplitude;
    normalization += amplitude;
    amplitude *= persistence;
    frequency *= lacunarity;
  }

  total /= normalization;
  total = smoothstep(-1.0, 1.0, total);

  return total;
}

void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {

  vec2 pixelCoords = uv * resolution;

  float noiseSample = fbm(vec3(pixelCoords, 0.0) * 0.005 +time *.1 , 4, 1., 2.0);

  vec4 sampler1 = texture2D(uChannel0, uv);

  vec4 sampler2 = vec4(vec3(luminance(sampler1.rgb)), sampler1.a);

  float d = sdfCircle(pixelCoords - uMousePos , 50. + noiseSample * 150.);

  vec4 color = sampler2;

  color = mix(sampler1,color,smoothstep(0.,2.,d));

  // glow
  float glowAmount = smoothstep(0., 32., abs(d));
  glowAmount = 1. - pow(glowAmount,.125);

  color.rgb += glowAmount * sampler1.rgb;
  
  outputColor = color;
}
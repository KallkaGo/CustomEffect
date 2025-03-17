#include './includes/common.glsl'

#define PI 3.14159

attribute vec3 start;
attribute vec3 end;
attribute vec3 rnd;

uniform vec4 pointsParams;
uniform vec3 bezierPos[NUM_SEGMENT];
uniform float time;
uniform float progress;
uniform float dir;

varying vec4 pointsData;
varying float vNowTime;
varying float alpha;

vec3 quadraticBezier(vec3 a, vec3 b, vec3 c, float t) {
  float s = 1. - t;
  vec3 q = s * s * a + 2. * s * t * b + t * t * c;
  return q;
}

void main() {
  // Because we need to take two points later
  const float numSegment = float(NUM_SEGMENT) - 2.;

  float nowTime = fract(time * rnd.x + rnd.y * 4.);

  int i0 = int(nowTime * numSegment);
  int i1 = i0 + 1;
  int i2 = i0 + 2;

  int POINTS_SEGMENTS = int(pointsParams.x);
  int POINTS_VERTICES = (POINTS_SEGMENTS + 1) * 2;

  int vertexFB_ID = gl_VertexID % (POINTS_VERTICES * 2);
  int vertex_ID = vertexFB_ID % POINTS_VERTICES;

  int xTest = vertex_ID & 0x1;
  int zTest = (vertexFB_ID >= POINTS_VERTICES) ? -1 : 1;

  float xSide = float(xTest);
  float zSide = float(zTest);

  float heightPercent = float(vertex_ID - xTest) / (float(POINTS_SEGMENTS) * 2.);

  float width = .06;

  float height = .06;

  float x = (xSide - 0.5) * width;
  float y = heightPercent * height - height / 2.;
  float z = 0.;

  vec3 pointsLocalPosition = vec3(x, y, z);

  float p0 = float(i0) / numSegment;
  vec3 startPoint = mix(bezierPos[i0], bezierPos[i1], .5);
  vec3 endPoint = mix(bezierPos[i1], bezierPos[i2], .5);
  // Maps to the percentage within the current segment
  // ex. nowTime = 0.6  i0 = int(0.6 * 8) =4  p0 = 4/8 = 0.5 nowTime - p0= 0.6 - 0.5 = 0.1 but in fact  Currently it has reached 4.8, int rounded down to 4
  // 4.8 - 4 = (nowTime - p0) * 8
  vec3 nextPoint = quadraticBezier(startPoint, bezierPos[i1], endPoint, (nowTime - p0) * numSegment);

  vec3 newPosition = nextPoint + vec3(rotate(pointsLocalPosition.xy, nowTime * 15. * dir) * rnd.z, 0.) + mix(start, end, remap(sin(nowTime * PI * 1.5), -1., 1., 0., 1.)) * mix(.2, 1., smoothstep(.3, 1., nowTime + rnd.y));

  alpha = smoothstep(0., .5, sin(nowTime * PI)) * rnd.z * (1. - smoothstep(progress - .3, progress, nowTime));

  gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);

  vNowTime = nowTime;
  pointsData = vec4(xSide, heightPercent, start.z, rnd.y);
}
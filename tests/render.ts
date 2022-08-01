const canvas = document.createElement('canvas');
const renderer = new RenderWebGL(canvas, 100, 200, 100, 200);

// updateDrawableProperties should be deprecated
renderer.updateDrawableProperties(10, {
  whirl: 10,
  position: [20, 30]
});

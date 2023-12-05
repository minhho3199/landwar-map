import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "lil-gui";
/**
 * Base
 */
//Camera

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
const camera = new THREE.OrthographicCamera(-50, 50, 50, -50);
const hsv2name = (h, s, v) => clrLkp.find(([clr, val]) => h >= val) && clrLkp.find(([clr, val]) => h >= val)[0];
function rgb2hsv(r, g, b) {
  let v = Math.max(r, g, b),
    n = v - Math.min(r, g, b);
  let h = n && (v == r ? (g - b) / n : v == g ? 2 + (b - r) / n : 4 + (r - g) / n);
  return [60 * (h < 0 ? h + 6 : h), v && n / v, v];
}

const clrLkp = [
  ["red", 0],
  ["vermilion", 15],
  ["brown", 20],
  ["orange", 30],
  ["safran", 45],
  ["yellow", 60],
  ["light green yellow", 75],
  ["green yellow", 90],
  ["limett", 105],
  ["dark green", 120],
  ["green", 120],
  ["light blue-green", 135],
  ["blue green", 150],
  ["green cyan", 165],
  ["cyan", 180],
  ["blaucyan", 195],
  ["green blue", 210],
  ["light green blue", 225],
  ["blue", 240],
  ["indigo", 255],
  ["violet", 270],
  ["blue magenta", 285],
  ["magenta", 300],
  ["red magenta", 315],
  ["blue red", 330],
  ["light blue red", 345],
].reverse();
//Canvas
const canvas = document.querySelector("canvas.webgl");
//Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color("#101719");
// Object
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

const frustumSize = 1.5;

//Load in textures
const textureLoader = new THREE.TextureLoader();

const mapTexture = await textureLoader.loadAsync("assets/map.png");

const geometry = new THREE.PlaneGeometry(4, 3);
const material = new THREE.ShaderMaterial({
  uniforms: {
    uTexture: { value: mapTexture },
    scale: { value: new THREE.Vector2(1, 1) },
  },
  vertexShader: `
        varying vec2 vUv;
        void main(){
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
        }`,
  fragmentShader: `
          uniform sampler2D uTexture;
          uniform vec2 scale;
          varying vec2 vUv;
          void main()	{
            // SCALE, background size cover
            vec2 newUV = (vUv - vec2(0.5))/scale + vec2(0.5);
            gl_FragColor = texture2D(uTexture,newUV);
          }
         `,
});
const mesh = new THREE.Mesh(geometry, material);
mesh.name = "Map";
// const mesh = new THREE.Sprite(material)
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
});

renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
// document.body.appendChild(renderer.domElement);
renderer.domElement.addEventListener("mousemove", onDocumentMouseMove2D, false);

const controls = new OrbitControls(camera, canvas);
controls.mouseButtons = { LEFT: THREE.MOUSE.PAN, RIGHT: THREE.MOUSE.ROTATE };
controls.touches = { ONE: THREE.TOUCH.PAN, TWO: THREE.TOUCH.DOLLY_PAN };
controls.enableRotate = false;
controls.minZoom = 0.95;
controls.maxZoom = 2;
controls.minDistance = camera.near;
controls.maxDistance = camera.far;

controls.reset();
const bbox = new THREE.Box3().setFromObject(mesh);
scene.add(mesh);

camera.position.set(0, 0, 80);
camera.updateProjectionMatrix();
//Controls

scene.add(camera);

// Renderer

// const limitPan = createLimitPan({ camera, controls });
// controls.addEventListener("change", () => {
//   //   console.log(controls.target);
//   console.log(camera.zoom);
//   if (camera.zoom === 1) {
//     controls.reset();
//   }
//   limitPan({
//     maxX: camera.zoom === 1 ? 0 : (0 + camera.right + camera.zoom) / 4,
//     minX: camera.zoom === 1 ? 0 : -(0 + camera.right + camera.zoom) / 4,
//     minY: camera.zoom === 1 ? 0 : (0 + camera.bottom / camera.zoom) / 2,
//     maxY: camera.zoom === 1 ? 0 : -(0 + camera.bottom / camera.zoom) / 2,
//   });
// });

var modal = document.getElementById("myModal");
var span = document.getElementsByClassName("close")[0];
var modalText = document.getElementById("modalContentText");
// When the user clicks on <span> (x), close the modal
span.onclick = function () {
  modal.style.display = "none";
};

function onDocumentMouseMove2D(event) {
  event.preventDefault();

  render();
}

function render() {
  let x1 = camera.position.x + camera.left / camera.zoom;
  let x1a = Math.max(x1, bbox.min.x);
  let pos_x = x1a - camera.left / camera.zoom;

  let x2 = pos_x + camera.right / camera.zoom;
  let x2a = Math.min(x2, bbox.max.x);
  pos_x = x2a - camera.right / camera.zoom;

  let y1 = camera.position.y + camera.bottom / camera.zoom;
  let y1a = Math.max(y1, bbox.min.y);
  let pos_y = y1a - camera.bottom / camera.zoom;

  let y2 = pos_y + camera.top / camera.zoom;
  let y2a = Math.min(y2, bbox.max.y);
  pos_y = y2a - camera.top / camera.zoom;
  camera.position.set(pos_x, pos_y, camera.position.z);
  camera.lookAt(pos_x, pos_y, controls.target.z);
  controls.target.set(pos_x, pos_y, 0);
  controls.update();
  renderer.render(scene, camera);
}

// const clock = new THREE.Clock();

// const tick = () => {
//   const elapsedTime = clock.getElapsedTime();
//   //   console.log(controls);
//   // Update controls
//   //   var min_x = camera.left - boundingBox.min.x;
//   //   var max_x = camera.right - boundingBox.max.x;
//   //   var min_y = camera.top - boundingBox.min.y;
//   //   var max_y = camera.bottom - boundingBox.max.y;

//   //   let pos_x = Math.min(max_x, Math.max(min_x, camera.position.x));
//   //   let pos_y = Math.min(max_y, Math.max(min_y, camera.position.y));

//   //   camera.position.set(pos_x, pos_y, camera.position.z);
//   //   camera.lookAt(pos_x, pos_y, controls.target.z);

//   //   controls.target.x = pos_x;
//   //   controls.target.y = pos_y;
//   //   mesh.rotation.setFromRotationMatrix(camera.matrix);

//   // Render
//   //   controls.update();
//   renderer.render(scene, camera);

//   // Call tick again on the next frame
//   window.requestAnimationFrame(tick);
// };

function resize() {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;
  const aspect = sizes.width / sizes.height;

  camera.aspect = sizes.width / sizes.height;
  camera.left = (frustumSize * aspect) / -2;
  camera.right = (frustumSize * aspect) / 2;
  camera.top = frustumSize / 2;
  camera.bottom = -frustumSize / 2;
  camera.updateProjectionMatrix();
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
}
window.addEventListener("resize", resize);
resize();
animate();

function animate() {
  requestAnimationFrame(animate);
  controls.update();
}

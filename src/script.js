import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "lil-gui";
/**
 * Base
 */
//Camera
const Aquatic_Realm = [
  4, 5, 6, 7, 14, 33, 39, 41, 49, 50, 58, 70, 73, 76, 80, 85, 86, 90, 95, 96, 99, 108, 115, 120, 121, 127, 133, 135,
  136, 140, 143, 144, 149, 153, 154, 155, 156, 157, 158, 160, 161, 163, 164, 168, 169, 186, 187, 189, 191, 192, 209,
  210, 213, 222, 238, 245, 253, 255, 260, 261, 266, 270, 271, 272, 273, 275, 277, 279, 285, 290, 292, 293, 300, 302,
  305, 307, 308, 309, 311, 319, 322, 327, 333, 337, 342, 343, 350, 351, 353, 357, 360, 363, 367, 368, 376, 380, 383,
  386, 387, 388,
];
const Glacial_Realm = [
  0, 3, 8, 11, 13, 18, 19, 20, 21, 27, 29, 34, 40, 43, 44, 46, 47, 52, 54, 57, 65, 67, 68, 71, 72, 91, 94, 97, 105, 117,
  122, 129, 131, 134, 146, 148, 150, 152, 174, 177, 181, 182, 183, 190, 198, 199, 203, 204, 205, 207, 214, 215, 216,
  221, 224, 226, 231, 236, 237, 239, 241, 247, 257, 259, 262, 264, 274, 280, 282, 283, 286, 291, 297, 303, 304, 315,
  320, 323, 324, 326, 328, 329, 332, 339, 340, 344, 345, 348, 352, 354, 356, 359, 362, 371, 372, 379, 390, 391, 393,
  396,
];
const Golem_Realm = [
  9, 10, 12, 15, 16, 26, 31, 32, 35, 36, 37, 45, 48, 53, 56, 59, 60, 62, 64, 75, 81, 83, 84, 89, 92, 93, 107, 110, 111,
  124, 125, 130, 132, 137, 138, 141, 142, 145, 151, 162, 167, 171, 172, 173, 176, 178, 185, 193, 194, 195, 202, 206,
  212, 219, 220, 223, 225, 227, 228, 229, 232, 233, 235, 246, 248, 251, 252, 254, 256, 265, 267, 268, 276, 281, 284,
  287, 288, 289, 294, 295, 298, 299, 312, 314, 325, 331, 334, 336, 341, 347, 355, 361, 366, 369, 374, 377, 385, 389,
  392, 398,
];
const Inferno_Realm = [
  1, 2, 17, 22, 23, 24, 25, 28, 30, 38, 42, 51, 55, 61, 63, 66, 69, 74, 77, 78, 79, 82, 87, 88, 98, 100, 101, 102, 103,
  104, 106, 109, 112, 113, 114, 116, 118, 119, 123, 126, 128, 139, 147, 159, 165, 166, 170, 175, 179, 180, 184, 188,
  196, 197, 200, 201, 208, 211, 217, 218, 230, 234, 240, 242, 243, 244, 249, 250, 258, 263, 269, 278, 296, 301, 306,
  310, 313, 316, 317, 318, 321, 330, 335, 338, 346, 349, 358, 364, 365, 370, 373, 375, 378, 381, 382, 384, 394, 395,
  397, 399,
];

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

const imageSize = {
  // width: 4096,
  // height: 3522,
  width: 100,
  height: 100,
};
const frustumSize = 1.5;

//Load in textures
const textureLoader = new THREE.TextureLoader();
let flag = textureLoader.load("assets/flag.png");
let flagHover = textureLoader.load("assets/flag_hover.png");
const mapTexture = await textureLoader.loadAsync("assets/map.png");
let imagedata = getImageData(mapTexture.image);
console.log(imagedata);
const colorGroup = {};

for (let x = 0; x < imageSize.width; x++) {
  for (let z = 0; z < imageSize.height; z++) {
    const pixelInfo = getPixel(imagedata, x, z);
    var color = pixelInfo.rgb;
    // orange, light blue-green, light green blue, yellow
    if (colorGroup[pixelInfo.colorName]) {
      colorGroup[pixelInfo.colorName] = colorGroup[pixelInfo.colorName] + 1;
    } else {
      colorGroup[pixelInfo.colorName] = 1;
    }
  }
}

console.log(colorGroup);
const infernoRealmColorNum = colorGroup["orange"];
const aquaticRealmColorNum = colorGroup["light blue-green"];
const glacialRealmColorNum = colorGroup["light green blue"];
const golemRealmColorNum = colorGroup["yellow"];

const landSLots = {
  Inferno_Realm: mapingSlotLand(Inferno_Realm, infernoRealmColorNum),
  Aquatic_Realm: mapingSlotLand(Aquatic_Realm, aquaticRealmColorNum),
  Glacial_Realm: mapingSlotLand(Glacial_Realm, glacialRealmColorNum),
  Golem_Realm: mapingSlotLand(Golem_Realm, golemRealmColorNum),
};
console.log(landSLots);
const chooseColors = {
  orange: "Inferno_Realm",
  "light blue-green": "Aquatic_Realm",
  "light green blue": "Glacial_Realm",
  yellow: "Golem_Realm",
};

let _tmpInferno = 0;
let _tmpAquatic = 0;
let _tmpGlacial = 0;
let _tmpGolem = 0;

for (let x = 0; x < imageSize.width; x++) {
  for (let z = 0; z < imageSize.height; z++) {
    const pixcelInfo = getPixel(imagedata, x, z);
    var color = pixcelInfo.rgb;

    if (chooseColors[pixcelInfo.colorName] == "Inferno_Realm") {
      if (landSLots.Inferno_Realm[_tmpInferno] !== undefined) {
        addLandMesh(x, z, color, "Inferno_Realm", landSLots.Inferno_Realm[_tmpInferno]);
      }
      _tmpInferno = _tmpInferno + 1;
    } else if (chooseColors[pixcelInfo.colorName] == "Aquatic_Realm") {
      if (landSLots.Aquatic_Realm[_tmpAquatic] !== undefined) {
        addLandMesh(x, z, color, "Aquatic_Realm", landSLots.Aquatic_Realm[_tmpAquatic]);
      }
      _tmpAquatic = _tmpAquatic + 1;
    } else if (chooseColors[pixcelInfo.colorName] == "Glacial_Realm") {
      if (landSLots.Glacial_Realm[_tmpGlacial] !== undefined) {
        addLandMesh(x, z, color, "Glacial_Realm", landSLots.Glacial_Realm[_tmpGlacial]);
      }
      _tmpGlacial = _tmpGlacial + 1;
    } else if (chooseColors[pixcelInfo.colorName] == "Golem_Realm") {
      if (landSLots.Golem_Realm[_tmpGolem] !== undefined) {
        addLandMesh(x, z, color, "Golem_Realm", landSLots.Golem_Realm[_tmpGolem]);
      }
      _tmpGolem = _tmpGolem + 1;
    }
  }
}

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

function mapingSlotLand(ids, slotNum) {
  const totalLand = ids.length;
  const landDistance = Math.floor(slotNum / totalLand);
  const returnMaping = {};
  ids.map((id, i) => {
    returnMaping[i * landDistance] = id;
  });
  return returnMaping;
}

function addLandMesh(x, z, color, landType, landId) {
  const _geometry = new THREE.BoxGeometry(1, 0.2, 1);
  const _material = new THREE.MeshBasicMaterial({
    map: flag,
    transparent: true,
  });
  const mesh = new THREE.Mesh(_geometry, _material);
  mesh.position.x = x - imageSize.height / 2;
  mesh.position.y = 0;
  mesh.position.z = z - imageSize.width / 2;
  mesh.scale.x = 0.99;
  // mesh.scale.y = Math.random();
  mesh.scale.z = 0.99;
  mesh.updateMatrix();
  mesh.matrixAutoUpdate = false;
  mesh.callback = function () {
    console.log(landId);
    modalText.innerText = `
        Selected land id: ${landId}
        ${landType}
        `;
    modal.style.display = "block";
  };
  scene.add(mesh);
}

var modal = document.getElementById("myModal");
var span = document.getElementsByClassName("close")[0];
var modalText = document.getElementById("modalContentText");
// When the user clicks on <span> (x), close the modal
span.onclick = function () {
  modal.style.display = "none";
};

function onDocumentMouseDown(event) {
  pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
  pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

  // update the picking ray with the camera and pointer position
  raycaster.setFromCamera(pointer, camera);

  // calculate objects intersecting the picking ray
  const intersects = raycaster.intersectObjects(scene.children);

  if (intersects.length > 0 && intersects[0].object.callback) {
    intersects[0].object.callback();
  }
}

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
window.addEventListener("click", onDocumentMouseDown, false);
resize();
animate();
function animate() {
  requestAnimationFrame(animate);
  controls.update();
}

function getImageData(image) {
  var canvas = document.createElement("canvas");
  canvas.width = image.width;
  canvas.height = image.height;

  var context = canvas.getContext("2d");
  context.drawImage(image, 0, 0);

  return context.getImageData(0, 0, image.width, image.height);
}
function getPixel(imagedata, x, y) {
  const imagePixcelWidth = Math.floor(imagedata.width / imageSize.width);
  const imagePixcelHeigh = Math.floor(imagedata.height / imageSize.height);

  const position = (imagedata.width * y * imagePixcelHeigh + x * imagePixcelWidth) * 4;
  const data = imagedata.data;
  const hsv = rgb2hsv(data[position], data[position + 1], data[position + 2]);
  console.log(hsv);
  return {
    hsv,
    colorName: hsv2name(...hsv),
    rgb: `rgb(${data[position]}, ${data[position + 1]}, ${data[position + 2]})`,
  };
  // return `rgb(${data[ position ]}, ${data[ position + 1 ]}, ${data[ position + 2 ]})`
  // return { r: data[ position ], g: data[ position + 1 ], b: data[ position + 2 ], a: data[ position + 3 ] };
}

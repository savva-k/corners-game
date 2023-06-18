import * as THREE from 'three';
import * as TWEEN from '@tweenjs/tween.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

import boardLightTexture from '../../assets/texture/board-light.png'
import boardDarkTexture from '../../assets/texture/board-dark.png'
import starsTexture from '../../assets/texture/stars.jpg'
import graniteTexture from '../../assets/texture/granite.jpg'

import piece from '../../assets/model/piece.glb'

const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap; 
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
// const orbit = new OrbitControls(camera, renderer.domElement);
scene.background = new THREE.TextureLoader().load(starsTexture);

// Why CubeTextureLoader doesn't work?

const boardCellGeometry = new THREE.BoxGeometry(1, 0.2, 1);
const boardCellLightMaterial = new THREE.MeshPhongMaterial({ map: new THREE.TextureLoader().load(boardLightTexture) });
const boardCellDarkMaterial = new THREE.MeshPhongMaterial({ map: new THREE.TextureLoader().load(boardDarkTexture) });
const graniteMaterial = new THREE.MeshPhongMaterial({ map: new THREE.TextureLoader().load(graniteTexture) });

const boardGroup = new THREE.Object3D();
const boardOffsetX = -4;
const boardOffsetZ = -4;

for (let file = 0; file < 8; file++) {
    let material = file % 2 === 0 ? boardCellDarkMaterial : boardCellLightMaterial;
    for (let rank = 0; rank < 8; rank++) {
        let cube = new THREE.Mesh(boardCellGeometry, material);
        cube.position.x = rank + boardOffsetX;
        cube.position.z = file + boardOffsetZ;
        cube.name = files[file] + (rank + 1);
        cube.receiveShadow = true;
        cube.layers.enable(1);
        boardGroup.add(cube);
        material = material == boardCellLightMaterial ? boardCellDarkMaterial : boardCellLightMaterial;
    }
}

boardGroup.receiveShadow = true;
scene.add(boardGroup);

// const planeGeometry = new THREE.PlaneGeometry(30, 30);
// const planeMaterial = new THREE.MeshBasicMaterial({
//     color: 0xC5C5C5,
//     side: THREE.DoubleSide
// });
// const plane = new THREE.Mesh(planeGeometry, planeMaterial);
// scene.add(plane);
// plane.rotation.x = -0.5 * Math.PI;
// plane.position.y = -0.1;
// plane.receiveShadow = true;

const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

function degreesToRadians(degrees) {
    return degrees * (Math.PI / 180);
} 


camera.position.z = -0.5;
camera.position.x = -0.5;
camera.position.y = 7;
camera.lookAt(-0.5, 0, -0.5);
camera.rotateZ(degreesToRadians(-90));


const gridHelper = new THREE.GridHelper(30);
// scene.add(gridHelper);

// orbit.autoRotate = true;

// light

const light = new THREE.DirectionalLight(0xFFFFFF, 0.7);
light.castShadow = true;
light.position.set(2, 6, 2);
light.lookAt(-0.5, 0, -0.5);

scene.add(light);

// const helper = new THREE.DirectionalLightHelper(light);
// const dLightShadowHelper = new THREE.CameraHelper(light.shadow.camera);
// scene.add(helper);
// scene.add(dLightShadowHelper);


const loader = new GLTFLoader();

loader.load(piece, function (gltf) {
    const cube1 = boardGroup.getObjectByName('a1');
    const modelScene = gltf.scene;
    modelScene.position.z = cube1.position.z;
    modelScene.position.x = cube1.position.x;
    modelScene.position.y = 0.2;
    modelScene.traverse(o => {
        if (o.isMesh) {
            o.material = graniteMaterial;
            o.castShadow = true;
        }
    })
    modelScene.name = 'piece';
	scene.add(modelScene);

    // tweenBetween(['a1', 'a3', 'a5', 'c5', 'c7', 'e7', 'e5', 'e3', 'e1', 'c1', 'a1'], 'piece');
    // tweenBetween(['c3', 'c4', 'c5', 'c6', 'd6', 'e6', 'f6', 'f5', 'f4', 'f3', 'e3', 'd3', 'c3'], 'piece');
    // tweenBetween(['a1', 'a2', 'a1'], 'piece');
}, undefined, function (error) {
	console.error(error);
} );

function _createTweenBetweenTwoCells(srcCube, dstCube, piece, callback) {
    const initialX = srcCube.position.x;
    const initialY = piece.position.y;
    const initialZ = srcCube.position.z;

    const destinationX = dstCube.position.x;
    const destinationZ = dstCube.position.z;

    const middlewayX = (destinationX + initialX) / 2;
    const middlewayY = initialY + 0.7;
    const middlewayZ = (destinationZ + initialZ) / 2;

    const tweenStart = new TWEEN.Tween({ x: initialX, y: initialY, z: initialZ})
    .to({ x: middlewayX, y: middlewayY, z: middlewayZ }, 500)
    .onUpdate((coords) => {
        piece.position.x = coords.x;
        piece.position.y = coords.y;
        piece.position.z = coords.z;
    })
    .easing(TWEEN.Easing.Quadratic.In);

    const tweenEnd = new TWEEN.Tween({ x: middlewayX, y: middlewayY, z: middlewayZ})
    .to({ x: destinationX, y: initialY, z: destinationZ }, 500)
    .onUpdate((coords) => {
        piece.position.x = coords.x;
        piece.position.y = coords.y;
        piece.position.z = coords.z;
    })
    .easing(TWEEN.Easing.Quadratic.Out);

    tweenStart.chain(tweenEnd);
    callback && tweenEnd.onComplete(callback);

    return {
        start: tweenStart,
        end: tweenEnd
    };
}

function tweenBetween(cells, piece) {
    if (cells.length < 2) {
        throw new "cells is an array of minimum 2 elements, where cells[0] = source cell, cells[last] = destination cell, the rest are intermediate cells";
    }

    const pieceMesh = scene.getObjectByName(piece);

    const srcCube = boardGroup.getObjectByName(cells[0]);
    const dstCube = boardGroup.getObjectByName(cells[1]);
    let firstTween = null;
    let lastTween = null;

    for (let src = 0; src < cells.length - 1; src++) {
        const srcCube = boardGroup.getObjectByName(cells[src]);
        const dstCube = boardGroup.getObjectByName(cells[src + 1]);

        let callback = null;
        if (src === cells.length - 2) {
            callback = () => {
                const srcProps = light.position.x > 0 ? { x: 2, y: 6, z: 2 } : { x: -2, y: 6, z: -2 };
                const dstProps = light.position.x > 0 ? { x: -2, y: 6, z: -2 } : { x: 2, y: 6, z: 2 };
                const lightTween = new TWEEN.Tween(srcProps)
                    .to(dstProps, 500)
                    .onUpdate((coords) => {
                        light.position.set(coords.x, coords.y, coords.z);
                    });
                lightTween.start();
            }
        }
        
        let newTween = _createTweenBetweenTwoCells(srcCube, dstCube, pieceMesh, callback);
        if (firstTween === null) {
            firstTween = newTween.start;
            lastTween = newTween.end;
        } else {
            lastTween.chain(newTween.start);
            lastTween = newTween.end;
        }
    }

    // lastTween.chain(firstTween);
    
    firstTween.start();
}

const mousePosition = new THREE.Vector2();

// window.addEventListener('mousedown', (() => {
//     let animationInProgess = false;

//     return (e) => {
//         if (animationInProgess) return;

//         mousePosition.x = (e.clientX / window.innerWidth) * 2 - 1;
//         mousePosition.y = - (e.clientY / window.innerHeight) * 2 + 1;

//         raycaster.setFromCamera(mousePosition, camera);
//         const intersects = raycaster.intersectObjects(scene.children);

//         if (intersects.length != 0) {
//             animationInProgess = true;
//             const mesh = boardGroup.getObjectByName(intersects[0].object.name)

//             if (!mesh) {
//                 animationInProgess = false;
//                 return
//             };
//             const initialY = mesh.position.y;

//             const tween1 = new TWEEN.Tween({y: initialY})
//                 .to({y: initialY + 1}, 300)
//                 .onUpdate((coords) => {
//                     mesh.position.y = coords.y;
//                 });
//             const tween2 = new TWEEN.Tween({y: initialY + 1})
//                 .to({y: initialY}, 300)
//                 .onUpdate((coords) => {
//                     mesh.position.y = coords.y;
//                 })
//                 .onComplete(() => animationInProgess = false);

//             tween1.chain(tween2);
//             tween1.start();
//         }
//     }
// })());

window.addEventListener('mousedown', (() => {
    let sourceLocation = null;

    return (e) => {
        mousePosition.x = (e.clientX / window.innerWidth) * 2 - 1;
        mousePosition.y = - (e.clientY / window.innerHeight) * 2 + 1;

        raycaster.setFromCamera(mousePosition, camera);
        const intersects = raycaster.intersectObjects(scene.children);

        if (intersects.length != 0) {
            animationInProgess = true;
            const mesh = boardGroup.getObjectByName(intersects[0].object.name)

            if (!mesh) {
                return
            };

            if (sourceLocation) {
                tweenBetween([sourceLocation, mesh.name], 'piece');
                sourceLocation = null;
            } else {
                sourceLocation = mesh.name;
            }
            

        }
    }
})());

const raycaster = new THREE.Raycaster();
raycaster.layers.set(1);

function animate(t) {
    // let piece = scene.getObjectByName('piece');
    // if (piece) {
    //     camera.lookAt(piece.position);
    // }

    TWEEN.update(t);
    // orbit.update();
	requestAnimationFrame(animate);
	renderer.render(scene, camera);
}

animate();
// 坐标轴
// var axes = new THREE.AxesHelper(30);
// scene.add(axes);

// 性能控件
var Stats = require ('../lib/stats.min.js');
stats = new Stats();
container.appendChild(stats.dom);

function renderPerformer() {
    global.renderer.render(scene, camera);

    stats.update();
    requestAnimationFrame(renderPerformer);
}
renderPerformer();

// 控制
var gui = {
    lightY: 30,
    rotateSpeed: 0.02
 }
 
 var datGui = new dat.GUI();
 
 /**
  * gui.add(obj，attr，min，max）
  */
 datGui.add(gui, "lightY", 0, 100);
 datGui.add(gui, "rotateSpeed", 0, 1);

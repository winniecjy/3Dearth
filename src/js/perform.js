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

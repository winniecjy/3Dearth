var transformControls, dragControls, controls;
const play = {
    start: function () {
        // this.initControls();
        this.render();
    },
    initControls: function () {
        // controls = new THREE.OrbitControls(camera, renderer.domElement);
        // controls.rotateSpeed = 1.0;
        // controls.enableZoom = false;
        // controls.dampingFactor = 0.3;
        // controls.target = new THREE.Vector3(0, 0, 0)


        // 添加平移控件
        transformControls = new THREE.TransformControls(camera, renderer.domElement);
        transformControls.setMode("rotate");
        scene.add(transformControls);
        var earthGroup = [];
        scene.children.map(function (item) {
            if (item.name == "earthGroup") earthGroup.push(item)
        })
        dragControls = new THREE.DragControls(scene.children, camera, renderer.domElement);
        dragControls.enabled = true;
        dragControls.addEventListener('hoveron', function(event) {
            console.log(event)
            transformControls.attach(scene.children);
            console.log('hover');
        })
        console.log(transformControls)

        // dragControls.addEventListener('dragstart', function (event) {
        //     controls.enabled = false;
        //     // 变换控件对象与选中的对应那个object绑定
        //     // transformControls.attach(earthGroup);
        //     console.log("start")
        // });
        // dragControls.addEventListener('dragend', function (event) {
        //     controls.enabled = true;
        //     console.log("end")
        //     // 变换控件对象与选中的对应那个object绑定
        //     // transformControls.attach(earthGroup);
        // });
        console.log(dragControls)
    },
    render: function () {
        // controls.update();

        earth.rotation.y += 0.0005;
        cloud.rotation.y += 0.0003;
        renderer.render(scene, camera);

        var that = this;
        requestAnimationFrame(function () {
            that.render();
        });
    }
}

module.exports = play;
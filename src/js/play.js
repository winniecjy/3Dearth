require('../lib/tween.min.js');

// var transformControls, dragControls, controls;
var lastX, lastY, isTween, tween, cityLast,
    raycaster = new THREE.Raycaster(),
    mouse = new THREE.Vector2();

function rotate2Center(pos, radius) {
    var rotate = {};
    rotate.x = Math.asin(pos.y / radius);
    var temp = radius * Math.cos(rotate.x);
    rotate.y = Math.atan(pos.x/pos.z);
    
    return rotate;
}

/**
 * 
 * @param {绕X轴旋转弧度} intervalX 
 * @param {绕Y轴旋转弧度} intervalY 
 */
function rotateEarth(intervalX, intervalY) {
    isTween = true;
    if (tween) tween.stop();
    tween = new TWEEN.Tween({
            rotateY: earthGroup.rotation.y,
            rotateX: earthGroup.rotation.x,
            rotateLoc: locationGroup.rotation.y
        })
        .to({
            rotateY: earthGroup.rotation.y + intervalY,
            rotateX: earthGroup.rotation.x + intervalX,
            rotateLoc: locationGroup.rotation.y + intervalY
        }, 1000);
    tween.easing(TWEEN.Easing.Sinusoidal.InOut);
    var onUpdate = function () {
        earthGroup.rotation.y = this.rotateY;
        earthGroup.rotation.x = this.rotateX;
        locationGroup.rotation.y = this.rotateLoc;
        locationGroup.rotation.x = this.rotateX;
    }
    var onComplete = function () {
        isTween = false;
    }
    tween.onUpdate(onUpdate);
    tween.onComplete(onComplete);
    tween.start();
}

const play = {
    start: function () {
        // this.initControls();
        document.addEventListener('touchstart', this.touchStart);
        document.addEventListener('touchend', this.touchEnd);
        document.addEventListener('mousedown', this.click);
        this.render();
    },
    touchStart: function (event) {
        lastX = event.touches[0].clientX;
        lastY = event.touches[0].clientY;
    },
    touchEnd: function (event) {
        var recX = event.changedTouches[0].clientX;
        var recY = event.changedTouches[0].clientY;
        var intervalX = (recX - lastX) * .01;
        var intervalY = (recY - lastY) * .01;
        if (Math.abs(intervalX) < 0.1 && Math.abs(intervalY) < 0.1) return;
        // 垂直方向滚动限制
        if (earthGroup.rotation.x + intervalY > 1.6) intervalY = (1.6 - earthGroup.rotation.x);
        if (earthGroup.rotation.x + intervalY < -1.6) intervalY = (-1.6 - earthGroup.rotation.x);

        rotateEarth(intervalY, intervalX);
    },
    click: function (e) {
        e.preventDefault();
        // 鼠标点击位置的屏幕坐标转换成threejs中的标准坐标-1<x<1, -1<y<1
        mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
        // 依据照相机转换到视点坐标系
        // var vector = new THREE.Vector3(mouse.x, mouse.y, 0).unproject(camera);
        raycaster.setFromCamera(mouse, camera);
        // 获取raycaster直线和所有模型相交的数组集合
        var intersects = raycaster.intersectObjects(locationGroup.children, true);

        if (intersects.length > 0) {
            if(cityLast) cityLast.scale.set(1, 1, 1);
            // 只取第一个相交物体
            var city = intersects[0].object;
            cityLast = city;
            // 放大
            city.scale.set(1.5, 1.5, 1.5);

            // 显示城市名
            var cityName = city.name;
            var cityText = document.getElementById("cityName");
            cityText.className = "";
            setTimeout(function () {
                cityText.innerText = cityName;
                cityText.className = "showed";
            }, 500)

            // 旋转到中心
            var cityPos = city.pos;
            var rotateRad = rotate2Center(cityPos, cityRadius);
            var finalY = - rotateRad.y;
            while(earthGroup.rotation.y>0 && finalY+Math.PI*2 < earthGroup.rotation.y) finalY += Math.PI*2;
            while(earthGroup.rotation.y<0 && finalY-Math.PI*2 > earthGroup.rotation.y) finalY -= Math.PI*2;
            if(Math.abs(finalY - earthGroup.rotation.y) > Math.PI) {
                if(finalY > earthGroup.rotation.y) finalY -= Math.PI*2;
                else finalY += Math.PI*2;
            }
            console.log(rotateRad)
            // rotateRad.x-earthGroup.rotation.x, rotateRad.y-earthGroup.rotation.y
            rotateEarth(rotateRad.x-earthGroup.rotation.x, finalY-earthGroup.rotation.y);
        }

    },
    render: function () {
        var earthSpeed = Math.PI/1000;
        var cloudSpeed = 0.002;
        if (!isTween) {
            earthGroup.rotation.y += earthSpeed;
            locationGroup.rotation.y += earthSpeed;
        }
        cloud.rotation.x -= cloudSpeed;

        TWEEN.update();
        renderer.render(scene, camera);

        var that = this;
        requestAnimationFrame(function () {
            that.render();
        });
    }
}



module.exports = play;
require('../lib/tween.min.js');

// var transformControls, dragControls, controls;
var lastX, lastY;
const play = {
    start: function () {
        // this.initControls();
        document.addEventListener('touchstart', this.touchStart);
        document.addEventListener('touchend', this.touchEnd);
        this.render();
    },
    touchStart: function (event) {
        lastX = event.touches[0].clientX;
        lastY = event.touches[0].clientY;
    },
    touchEnd: function (event) {
        var recX = event.changedTouches[0].clientX;
        var recY = event.changedTouches[0].clientY;
        var intervalX = (recX - lastX)*.01;
        var intervalY = (recY - lastY)*.01;
        // 垂直方向滚动限制
        if(earthGroup.rotation.x+intervalY>1) intervalY = 1 - earthGroup.rotation.x;
        if(earthGroup.rotation.x+intervalY<-1) intervalY = -1 - earthGroup.rotation.x;
        var tween = new TWEEN.Tween({rotateY: earthGroup.rotation.y, rotateX: earthGroup.rotation.x})
                         .to({rotateY: earthGroup.rotation.y+intervalX, rotateX: earthGroup.rotation.x+intervalY}, 1000);
        tween.easing(TWEEN.Easing.Sinusoidal.InOut);
        var onUpdate = function() {
            earthGroup.rotation.y = this.rotateY;
            earthGroup.rotation.x = this.rotateX;
        }
        tween.onUpdate(onUpdate);
        tween.start();
    },
    render: function () {
        TWEEN.update();
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
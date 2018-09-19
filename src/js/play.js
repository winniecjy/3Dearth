require('../lib/tween.min.js');

// var transformControls, dragControls, controls;
var lastX, lastY, isTween, tween;
Math.formatFloat = function(f, digit) { 
    var m = Math.pow(10, digit); 
    return parseInt(f * m, 10) / m; 
} 
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
        var intervalX = (recX - lastX) * .01;
        var intervalY = (recY - lastY) * .01;
        if(Math.abs(intervalX)<0.1 && Math.abs(intervalY)<0.1) return;
        // 垂直方向滚动限制
        if (earthGroup.rotation.x + intervalY > 1.6) intervalY = (1.6 - earthGroup.rotation.x);
        if (earthGroup.rotation.x + intervalY < -1.6) intervalY = (-1.6 - earthGroup.rotation.x);

        isTween = true;
        if(tween) tween.stop();
        tween = new TWEEN.Tween({
                rotateY: earthGroup.rotation.y,
                rotateX: earthGroup.rotation.x,
                rotateLoc: locationGroup.rotation.y
            })
            .to({
                rotateY: earthGroup.rotation.y + intervalX,
                rotateX: earthGroup.rotation.x + intervalY,
                rotateLoc: locationGroup.rotation.y + intervalX
            }, 1000);
        tween.easing(TWEEN.Easing.Sinusoidal.InOut);
        var onUpdate = function () {
            earthGroup.rotation.y = this.rotateY;
            earthGroup.rotation.x = this.rotateX;
            locationGroup.rotation.y = this.rotateLoc;
            locationGroup.rotation.x = this.rotateX;
        }
        var onComplete = function() {
            earthGroup.rotation.y = Math.formatFloat(this.rotateY, 3);
            earthGroup.rotation.x = Math.formatFloat(this.rotateX, 3);
            locationGroup.rotation.y = Math.formatFloat(this.rotateLoc, 3);
            locationGroup.rotation.x = Math.formatFloat(this.rotateX, 3);
            isTween = false;
        }
        tween.onUpdate(onUpdate);
        tween.onComplete(onComplete);
        tween.start();
    },
    render: function () {
        var earthSpeed = 0.001;
        var cloudSpeed = 0.002;
        if (!isTween) {
            earth.rotation.y += earthSpeed;
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
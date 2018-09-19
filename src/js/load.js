/**
 * 
 * @param {经度} longitude 
 * @param {纬度} latitude 
 * @param {半径} radius 
 */

function lglt2xyz(latitude, longitude, radius) {
    var lg = THREE.Math.degToRad(longitude),
        lt = THREE.Math.degToRad(latitude);
    var y = radius * Math.sin(lt);
    var temp = radius * Math.cos(lt);
    var x = temp * Math.sin(lg);
    var z = temp * Math.cos(lg);
    console.log(x + "," + y + "," + z);
    // return {x:x , y:y ,z:z}
}

const load = {
    init: function () {
        this.initRender();
        this.initCamera();
        this.initScene();
        this.initLight();
        this.initEarth();
        this.initCity();
    },

    initCamera: function () {
        camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 43;
    },

    initScene: function () {
        scene = new THREE.Scene();
        // scene背景
        scene.opacity = 0;
        scene.transparent = true;
    },

    initRender: function () {
        renderer = new THREE.WebGLRenderer({
            alpha: true,
            antialias: true
        });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.shadowMap.enabled = true;
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setClearAlpha(0);
        container.appendChild(renderer.domElement);
    },

    initEarth: function () {
        // the earth
        var textureLoader = new THREE.TextureLoader();
        var geometry = new THREE.SphereBufferGeometry(15, 20, 20); /* 几何模型 */
        var material = new THREE.MeshPhongMaterial({
            color: 0xffffff,
            specular: 0x404040,
            shininess: 5,
            transparent: false,
            opacity: 1,
            overdraw: 0.5,
            map: textureLoader.load('../img/earth.jpg', function () {
                renderer.render(scene, camera);
            }),
            specularMap: textureLoader.load('../img/earth_spec.jpg', function () {
                renderer.render(scene, camera);
            }),
            bumpMap: textureLoader.load('../img/earth_bump.jpg', function () {
                renderer.render(scene, camera);
            })
        }); /* 材质 */

        earth = new THREE.Mesh(geometry, material);
        earth.rotation.y = 3.5;

        earthGroup = new THREE.Group();
        earthGroup.add(earth);

        cloud = new THREE.Mesh(
            new THREE.SphereGeometry(15.5, 24, 24),
            new THREE.MeshPhongMaterial({
                map: new THREE.TextureLoader().load('../img/earth_cloud.png', function () {
                    renderer.render(scene, camera);
                }),
                opacity: .98,
                transparent: true,
                blending: 'AdditiveBlending'
            })
        );
        earthGroup.add(cloud);
        earthGroup.name = "earthGroup";

        scene.add(earthGroup);
        renderer.render(scene, camera);

        console.log(earth)
    },

    initCity: function () {
        lglt2xyz(-19.2, 14.11666667-100, 16)
        // var canvas = document.createElement('canvas');
        // var texture = new THREE.Texture(canvas); 
        // texture.needsUpdate = true;
        // var spriteMaterial = new THREE.SpriteMaterial( 
        //     { map: texture, useScreenCoordinates: false, alignment: spriteAlignment } );
        // var sprite = new THREE.Sprite( spriteMaterial );
    },

    initLight: function () {
        var all = new THREE.AmbientLight(0x393939, .8);
        var light = new THREE.DirectionalLight(0xffffff, 1)
        light.position.set(-11, 3, 1);
        var sun = new THREE.SpotLight(0x393939, 2.5);
        sun.position.set(-15, 10, 21);

        scene.add(all);
        scene.add(sun);
        scene.add(light);
    }
}

module.exports = load;



// var light = new THREE.AmbientLight(0x404040, 1);
// scene.add(light)

// var listener = new THREE.AudioListener();
// camera.add(listener);
// var sound = new THREE.Audio(listener);
// // scene.add(audio);
// var musicLoader = new THREE.AudioLoader();
// musicLoader.load('./audio/bg-song.oog', function (buffer) {
//         sound.setBuffer(buffer);
//         sound.play();
//     },
//     function (xhr) {
//         console.log((xhr.loaded / xhr.total * 100) + "% is loaded");
//     })
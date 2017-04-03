/**
 * Created by xzywww on 2017-04-02.
 */
(function () {
    let renderer;
    const initRender = function () {
        renderer = new THREE.WebGLRenderer();
        renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(renderer.domElement);
        //设置阴影
        renderer.shadowMap.enabled = false;
        //平滑阴影
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    };

    //场景
    let scene;
    const initScene = function () {
        scene = new THREE.Scene();
    };

    //灯光
    const initLight = function (scene) {
        //全局白光
        const globalLight = function () {
            scene.add(new THREE.AmbientLight(0xffffff, 0.3));
        }

        //z轴正向点灯光
        const zLight = function () {
            let light = new THREE.SpotLight(0xffffff, 1);
            light.position.set(-50, 50, 100);
            light.castShadow = true;
            scene.add(light);
        }

        globalLight();
        zLight();
    }

    const init = function () {
        initRender();
        initScene();
        initLight();
    }
    window.initThree = init
})()

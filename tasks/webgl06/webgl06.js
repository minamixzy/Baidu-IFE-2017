/**
 * Created by xzywww on 2017-03-30.
 */
(function () {
    //渲染器
    let renderer;
    const initRender = function () {
        renderer = new THREE.WebGLRenderer();
        renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(renderer.domElement);
        //设置阴影
        renderer.shadowMap.enabled = true;
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

        //z轴正向照射灯光
        const zLight = function () {
            let light = new THREE.SpotLight(0xffffff, 1);
            light.position.set(-50, 50, 100);
            light.castShadow = true;
            scene.add(light);
        }

        globalLight();
        zLight();
    }

    //镜头
    let camera;
    const initCamera = function (near = 1, far = 3000) {
        camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, near, far);
        camera.position.set(50, 50, 50);
        camera.lookAt(new THREE.Vector3(0, 0, 0));
        scene.add(camera);
    };

    //创建控制器
    let controller;
    const initController = function () {
        controller = new THREE.TrackballControls(camera, renderer.domElement);
        controller.rotateSpeed = 6.0;
    }

    //受键盘控制的物体内容
    let keybordList = [];
    //出事的正向角度，为和x轴正向的夹角
    let forward = 0;

    //导入汽车模型
    let loader = new THREE.OBJLoader();
    loader.load('./test.obj', function (obj) {
        obj.castShadow = true;
        keybordList.push(obj);

        scene.add(obj);
    });


    //创造接收阴影的平面
    const createPlane = function (scene) {
        let geometry = new THREE.PlaneGeometry(150, 150, 32, 32);
        let material = new THREE.MeshLambertMaterial({color: 0x00ffff, side: THREE.DoubleSide});
        let plane = new THREE.Mesh(geometry, material);
        plane.rotateX(Math.PI / 2);
        plane.position.y = -23;
        plane.receiveShadow = true;
        scene.add(plane);
    }

    //监听键盘事件
    /* 监听键盘按键，把相应的键盘码记录在列表里
     *  如果连续触发，则只记录一次
     *  目前暂时认定W/S,A/D键冲突，不能重复记录
     * */
    let keyDown = {};
    const initEventlistener = function () {
        window.addEventListener('keydown', function (e) {
            keyDown[e.keyCode] = true;
        });
        window.addEventListener('keyup', function (e) {
            delete keyDown[e.keyCode];
        });
    }

    const moveCar = function () {
        xFoward = Math.cos(forward);
        zFoward = Math.sin(forward);

        keybordList.forEach((item) => {
            if (87 in keyDown) { //w
                item.position.x += xFoward;
                item.position.z += zFoward;
            }
            if (83 in keyDown) { //s
                item.position.x -= xFoward;
                item.position.z -= zFoward;
            }
            if (68 in keyDown) { //d
                forward += (Math.PI / 180);
                item.rotateY(-Math.PI / 180);
            }
            if (65 in keyDown) { //a
                forward -= (Math.PI / 180);
                item.rotateY(Math.PI / 180);
            }
        });
    }

    //帧数监视器
    let stats = new Stats();
    stats.showPanel(1); // 0: fps, 1: ms, 2: mb, 3+: custom
    document.body.appendChild( stats.dom );

    //主渲染函数
    const render = function () {
        //1 控制汽车移动
        moveCar();
        //2 渲染主页面
        renderer.render(scene, camera);
        //3 更新控制器
        controller.update();
        //4 更新帧数显示器
        stats.begin();
        stats.end();
        requestAnimationFrame(render);
    }

    //初始化
    const init = function () {
        initRender();
        initScene();
        initLight(scene);
        initCamera();
        initController();
        initEventlistener();
        
        createPlane(scene);

        render();
    };

    //导出
    window.initThree = init;
})();
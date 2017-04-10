/**
 * Created by xzywww on 2017-04-02.
 */
/*
 * todo 1.正向灯光
 * todo 2.根据json构建地球材质，然后通过THREE.Texture引入材质，渲染到地球上
 * */
;(function (window, THREE, echarts) {
    //初始化程序
    class Main {
        constructor() {
            this.initlization();
        }

        initlization() {
            this.initRender();
            this.initScene();
            this.initLight();
            this.initCamera();
            this.initController();
        }

        initRender() {
            this.renderer = new THREE.WebGLRenderer();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
            document.body.appendChild(this.renderer.domElement);
            //设置阴影
            this.renderer.shadowMap.enabled = false;
            //平滑阴影
            //this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        }

        initScene() {
            this.scene = new THREE.Scene();
        }

        initLight() {
            let that = this;
            let _scene = this.scene;

            const globalLight = function (scene) {
                scene.add(new THREE.AmbientLight(0xffffff, 0.3));
            }

            //z轴正向点灯光
            /*
             const zLight = function (scene) {
             that.light = new THREE.SpotLight(0xffffff, 1);
             that.light.position.set(-50, 50, 100);
             that.light.castShadow = true;
             scene.add(that.light);
             }
             */
            globalLight(_scene);
            //zLight(_scene);
        }

        initCamera() {
            //镜头
            this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 3000);
            this.camera.position.set(50, 50, 50);
            this.camera.lookAt(new THREE.Vector3(0, 0, 0));
            this.scene.add(this.camera);
        }

        initController() {
            this.controller = new THREE.TrackballControls(this.camera, this.renderer.domElement);
            this.controller.rotateSpeed = 6.0;
        }
    }

    //生成一个场景
    let testObj = new Main();

    //循环渲染
    const start = function () {
        testObj.renderer.render(testObj.scene, testObj.camera);
        testObj.controller.update();
        requestAnimationFrame(start);
    }

    //首先生成二维的echarts数据，然后转换为三维的地球模型
    let worldCanvas = document.createElement('div');

    (function (testObj, worldCanvas) {
        let xhr = new XMLHttpRequest()
        xhr.open('get', './world.json');
        //异步获取数据
        new Promise(function (resolved) {
            xhr.onload = function () {
                let world = xhr.responseText;
                //注册世界地图
                echarts.registerMap('world', world);
                let chart = echarts.init(worldCanvas)

                chart.setOption({
                    series: [{
                        type: 'map',
                        map: 'world'
                    }]
                })
                resolved(worldCanvas);
            }
        })
            .then(function (data) {
                //加载加载地图
                let material = new THREE.Texture(data)

                let geometry = new THREE.OctahedronBufferGeometry(60, 2);
                let cube = new THREE.Mesh(geometry, material);
                cube.castShadow = true;
                testObj.scene.add(cube);
            })
            .then(function () {
                start();
            })
            .catch(function (e) {
                console.warn(e);
            });

        xhr.send();
    })(testObj, worldCanvas);

})(window, THREE, echarts);





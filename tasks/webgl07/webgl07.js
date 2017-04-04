/**
 * Created by xzywww on 2017-04-02.
 */
;(function (window, THREE) {
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
            const zLight = function (scene) {
                that.light = new THREE.SpotLight(0xffffff, 1);
                that.light.position.set(-50, 50, 100);
                that.light.castShadow = true;
                scene.add(that.light);
            }

            globalLight(_scene);
            zLight(_scene);
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

    //测试物品
    let testObj = new Main();

    (function (obj) {
        //加载着色器
        let material = new THREE.ShaderMaterial( {

            uniforms: {
                color:{
                    type: 'v3',
                    value: new THREE.Color('#60371b')
                },
                light: {
                    type: 'v3',
                    value: (new THREE.Vector3(300,100,100))
                }
            },
            vertexShader: document.getElementById( 'vertexShader' ).textContent,
            fragmentShader: document.getElementById( 'fragmentShader' ).textContent

        } );

        let geometry = new THREE.OctahedronBufferGeometry(60, 2);
        let cube = new THREE.Mesh(geometry, material);
        cube.castShadow = true;
        obj.scene.add(cube);
    })(testObj);

    //循环渲染
    const start = function () {
        testObj.renderer.render(testObj.scene, testObj.camera);
        testObj.controller.update();
        requestAnimationFrame(start);
    }

    start();

})(window, THREE);



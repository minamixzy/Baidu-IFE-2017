/**
 * Created by xzywww on 2017-04-02.
 */
;(function (window, THREE) {
    class Main{
        constructor(){
            this.initlization();
        }
        initlization(){
            this.initRender();
            this.initScene();
            this.initLight();
        }
        initRender(){
            this.renderer = new THREE.WebGLRenderer();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
            document.body.appendChild(this.renderer.domElement);
            //设置阴影
            this.renderer.shadowMap.enabled = false;
            //平滑阴影
            this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        }
        initScene() {
            this.scene = new THREE.Scene();
        }
        initLight(){
            let _scene = this.scene;

            const globalLight = function (scene) {
                scene.add(new THREE.AmbientLight(0xffffff, 0.3));
            }

            //z轴正向点灯光
            const zLight = function (scene) {
                let light = new THREE.SpotLight(0xffffff, 1);
                light.position.set(-50, 50, 100);
                light.castShadow = true;
                scene.add(light);
            }

            globalLight(_scene);
            zLight(_scene);
        }

    }
    new Main();
})(window, THREE);



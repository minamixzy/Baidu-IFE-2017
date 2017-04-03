/**
 * Created by xzywww on 2017-04-02.
 */
;(function (window, Rx) {
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
            document.body.appendChild(renderer.domElement);
            //设置阴影
            this.renderer.shadowMap.enabled = false;
            //平滑阴影
            this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        }
        initScene() {
            this.scene = new THREE.Scene();
        }
        initLight(){
            const globalLight = function () {
                this.scene.add(new THREE.AmbientLight(0xffffff, 0.3));
            }

            //z轴正向点灯光
            const zLight = function () {
                let light = new THREE.SpotLight(0xffffff, 1);
                light.position.set(-50, 50, 100);
                light.castShadow = true;
                this.scene.add(light);
            }

            globalLight();
            zLight();
        }

    }
    new Main();
})(window);



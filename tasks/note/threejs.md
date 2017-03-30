# THREEjs

## 1. 基本用法


## x.视角控制插件
+ TrackballControls.js
```js
    let controller;
    const initController = function () {
        controller = new THREE.TrackballControls(camera, renderer.domElement);
        controller.rotateSpeed = 6.0; //更改旋转速度
    }

    //在rAF函数里面调用控制更新
    controller.update();
```

## x.2 帧数监控插件
stats.js
```js

```
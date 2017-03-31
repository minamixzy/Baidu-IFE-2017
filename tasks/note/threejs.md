# THREEjs

## 1. 基本用法


## x.1视角控制插件
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
var stats = new Stats();
stats.showPanel( 1 ); // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild( stats.dom );

function animate() {

	stats.begin();

	// monitored code goes here

	stats.end();

	requestAnimationFrame( animate );

}

requestAnimationFrame( animate );
```

## x.3 外部模型导入
+ 根据模型的数据类型，在examples/js/loaders引入对应的加载器
```js
//以obj格式为例
var loader = new THREE.OBJLoader();
loader.load('../lib/port.obj', function(obj) {
    mesh = obj; //储存到全局变量中
    scene.add(obj);
});
```
+ 有材质的外部模型导入
```html
<script type="text/javascript" src="MTLLoader.js"></script>

<script>
var mtlLoader = new THREE.MTLLoader();  
    mtlLoader.setBaseUrl( 'obj/' );  
    mtlLoader.setPath( 'obj/' );  
    mtlLoader.load( 'test.mtl', function( materials ) { 
        //先预加载 材质
        materials.preload();  
        //然后加载模型
        var objLoader = new THREE.OBJLoader(); 
        //设置模型为预加载好的材质 
        objLoader.setMaterials( materials );  
        objLoader.setPath( 'obj/' );  
        objLoader.load( 'test.obj', function ( object ) {  
            scene.add( object );  
    
            }, onProgress, onError );  
    
    });  
</script>
```
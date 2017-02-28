#数据绑定02

##任务要求
1. 在任务1里面，已经实现了基本的监听模式，任务2提出了递归检测和动态监听属性的需求；
2. 增加回调函数功能。

##实现思路
1. 首先考虑把任务1的方法抽象出来在创建Observer对象的时候调用；
2. 在setter函数里面，对传入的参数同样进行检测，调用这个抽象出来的方法；
3. 对于watch功能，比较简单，只要在setter方法里面添加一个接口，当赋值改变的时候，调用回调函数，
注意：这里面应当用全等比较。

##总结
1. 这次任务采用了class类型作为基础，这样做的目的是让代码结构更加清晰


defPorp是整个任务的核心，是从任务1里抽象得来的，无论是对象构造还是$watch接口都带用了该函数
```javascript
class Observer {
    constructor(obj) {
        this.data = new Object();
        this.data = Observer.setObserver(this.data, obj);
    }

    //把数据辅助到data里
    static setObserver(source, obj) {
        for (let key of Object.keys(obj)) {

            //修改get和set方法
            Observer.defPorp(source, key, obj[key]);

            //这里递归检测赋予的值是否还是对象
            if (typeof obj[key] === 'object' && obj[key] !== null) {
                source[key] = Observer.setObserver(source[key], obj[key]);
            }
        }
        return source;
    }

    //把定义属性的方法抽象出来
    static defPorp(source, key, data, callback = () => {
    }) {
        //这里用let保存局部变量
        let _data = data;

        Object.defineProperty(source, key, {
            configurable: true,
            enumerable: true,
            get(){
                console.log('你访问了 ' + key);
                return _data;
            },
            set(newVal){
                //检测是否发生了值改变
                if (_data !== newVal) {
                    console.log('你设置了 ' + key + ', 新的值为 ' + newVal);

                    if (typeof newVal === 'object' && newVal !== null) {
                        _data = new Object(); //注意这里要把_data设置为新对象，不然代码会报错
                        _data = Observer.setObserver(_data, newVal);
                    } else {
                        _data = newVal;
                    }

                    callback(newVal);
                }
                return _data;
            }
        });
    }

    $watch(objName, callback) {
        Observer.defPorp(this.data, objName, this.data[objName], callback);
    }
}
```

2. 从整体来看，代码的冗余度还是比较高，也不够简洁，尤其是对象检测上还有待提高，需要更加优雅的代码。

3. 这次用了闭包的私有属性_data 来保存数据，比起任务1的镜像属性来说要整洁很多，
但大量的闭包导致函数无法被gc回收，从性能上说可能得不偿失。


Anyway, make it work, make it right, make it fast. Step by Step! 

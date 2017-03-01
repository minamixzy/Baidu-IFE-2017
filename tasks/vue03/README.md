#数据绑定03

##任务要求
1. 这一题的要求是实现事件的冒泡传播

##实现思路
1. 提示给的很清楚了，就是维护一个事件栈，首先想到的是模拟浏览器的实现，在访问数据的时候依次把属性推入
栈内，直到找到目标属性，如果触发setter，就根据事件栈冒泡传播。
2. 问题的关键在于如何触发栈内元素的回调事件，本质上它们的对应保存的值(地址)并没有改变，由于之前代码的耦合程度很高，
向要抽离出回调事件还是有一定的难度。

##代码
```javascript
/**
 * Created by xzywww on 2017-02-27.
 */

class Observer {
    constructor(obj) {
        this.data = new Object();
        //根目录的调用栈应该是空的
        this.data = Observer.setObserver(this.data, obj);
    }

    //把obj的每一个数据复制到source上
    static setObserver(source, obj, callstcack = []) {
        for (let key of Object.keys(obj)) {
            source[key] = obj[key];
            //修改get和set方法
            Observer.defProp(source, key, callstcack);
        }
        return source;
    }

    //把定义属性的方法抽象出来
    static defProp(source, key, callstack = [], callback = () => {
    }) {
        //这里用let保存局部变量
        let _data = source[key];
        let $event = callback;

        //记录自己在数据结构中的调用栈
        let _callstack = [];
        callstack.forEach(function (eventLog) {
            _callstack.push(eventLog);
        });
        _callstack.push($event);

        //这里递归检测赋予的值是否还是对象,进一步劫持
        if (typeof _data === 'object' && _data !== null) {
            _data = new Object();
            _data = Observer.setObserver(_data, source[key], _callstack);
        }

        Object.defineProperty(source, key, {
            configurable: true,
            enumerable: true,
            get(){
                return _data;
            },
            set(newVal){
                if (_data !== newVal) {
                    if (typeof newVal === 'object' && newVal !== null) {
                        _data = new Object();
                        _data = Observer.setObserver(_data, newVal, _callstack);
                    } else {
                        _data = newVal;
                    }
                    //首先调用自身的回调函数
                    $event(newVal);

                    //冒泡事件栈，依次执行事件,-2是因为自身的事件已经执行过了
                    for (let i = _callstack.length - 2; i >= 0; i--) {
                        _callstack[i]();
                    }
                }
                return _data;
            }
        });
    }

    $watch(objName, callback) {
        Observer.defProp(this.data, objName, [], callback);
    }
}

let app2 = new Observer({
    name: {
        firstName: 'shaofeng',
        lastName: 'liang'
    },
    age: 25
});

app2.$watch('name', function (newName) {
    console.log('我的姓名发生了变化，可能是姓氏变了，也可能是名字变了。')
});
app2.data.name.firstName = 'hahaha';
// 输出：我的姓名发生了变化，可能是姓氏变了，也可能是名字变了。
app2.data.name.lastName = {
    xzy1:123,
    xzy2:223
};

```

##总结
1. 经过了调整，在每一次数据监听的时候传入一个栈，保存访问路径上的每一个回调函数。
2. 写完之后重新整理了一下思路，发现只有data下一级的数据才保存有回掉函数，
栈的方法有些多余，可能只需要保存子数据和对应的根数据即可。
3. 代码越来越复杂了，但后面还有2个任务，过早优化是万恶之源，我们任务四见。




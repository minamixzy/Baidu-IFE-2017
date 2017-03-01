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

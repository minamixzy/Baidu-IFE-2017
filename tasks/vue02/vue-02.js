/**
 * Created by xzywww on 2017-02-27.
 */


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

let app1 = new Observer({
    name: 'youngwind',
    age: 25
});
app1.$watch('age', function (age) {
    console.log(`我的年纪变了，现在已经是：${age}岁了`)
});


/* 需求，完成递归 */
#数据绑定05

##任务要求
1. 最后一个任务，合并前面的模块，实现dom的动态绑定。

##实现思路
1. 在经历了前面一路的修修改改之后，拿到这一题，心里已经有思路了，直接上局部更新的版本。
2. 任务的关键在于模板解析的时候，没访问到一次mustache里的变量，就通过$watch，给对应的数据注册一次事件。

##实现过程
#### 1. 事件队列化
 为了能够多次注册事件，我们在Observer里面的单独注册一个EventRegister对象，用于保存每一个Key所对应的回调事件
 ```javascript
    class EventRegister {
        constructor(obj) {
            for (let key of Object.keys(obj)) {
                this[key] = [];
            }
        }
        registerEvevt(key, callback) {
            this[key].push(callback);
        }
    }
```
对Observer做出相应的修改
```javascript
    class Observer {
        constructor(obj) {
            this._$eventRegister = new EventRegister(obj);
            Observer.setObserver(this, obj);
        }

        //把obj的每一个数据复制到source上
        static setObserver(source, obj, rootKey) {
            for (let key of Object.keys(obj)) {
                source[key] = obj[key];
                //修改get和set方法
                rootKey = rootKey ? rootKey : source._$eventRegister[key];
                Observer.defProp(source, key, rootKey);
            }
            return source;
        }

        //把定义属性的方法抽象出来
        static defProp(source, key, rootKey) {
            //这里用let保存局部变量
            let _data = source[key];
            let _rootKey = rootKey;

            //这里递归检测赋予的值是否还是对象,进一步劫持
            if (typeof _data === 'object' && _data !== null) {
                _data = new Object();
                _data = Observer.setObserver(_data, source[key], _rootKey);
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
                            _data = Observer.setObserver(_data, newVal, _rootKey);
                        } else {
                            _data = newVal;
                        }

                        if (_rootKey.length > 0) {
                            _rootKey.forEach(function (fn) {
                                fn(newVal);
                            });
                        }
                    }
                    return _data;
                }
            });
        }

        $watch(objName, callback) {
            this._$eventRegister.registerEvevt(objName, callback);
        }
    }
```
#### 2. 模板解析修改
在解析mustache里，通过$watch注册相应的事件，这里只列出关键的代码
```javascript
    Vue.parseTextNode = function(textNode, data) {
        let txt = textNode.nodeValue;

        //首次模板解析的时候调用regReplace进行正则解析
        regReplace(textNode, data, txt, true);

        //用正则找到mustache语法里面的内容
        function regReplace(textNode, data, oldtext, firstTime) {
            textNode.nodeValue = oldtext.replace(/\{\{(\S+)\}\}/g, function (res, $1) {
                //暂时只考虑点语法
                let tokenArray = $1.trim().split('.');

                //如果是第一次的话执行注册
                if (firstTime) {
                    data.$watch(tokenArray[0], function () {
                        //因为之后的回调不需要注册data和textNode的关系了，传入false
                        regReplace(textNode, data, oldtext, false);
                    });
                }

                let _data = data;

                for (let token of tokenArray) {
                    _data = _data[token];
                }
                return _data.toString();
            });
        }
    }
```


##总结#
1. 以前曾经模仿着写过过jQuery的核心源码，感觉并不困难，但这在写Vue数据绑定任务的时候，颇废了一番功夫，前后反复多次推倒重来，
当然，最后的收获也是很大的，对Vue的理解又深入了一层。
2. 虽然完成了任务，但很多地方感觉有更好的实现方式，比如最后正则替换那一块，代码即难看又冗余。
看来自己的js内功还需要更多修炼。
3. 最后赞一下百度IFE这个平台，提供了这么多小而精的demo供我们练手，手动点赞，期待IFE越办越好!



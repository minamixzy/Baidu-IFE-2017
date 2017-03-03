/**
 * Created by xzywww on 2017-03-01.
 */
(function (window) {
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

    class Observer {
        constructor(obj) {
            //根目录的调用栈应该是空的
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

    const Vue = function(object) {
        let $data = new Observer(object.data);

        this.data = $data;

        Vue.parseHtml(object.el, $data);
    }

    Vue.parseHtml = function(selector, data) {
        let nodeList = Vue.qsa(selector);

        //这是文本处理的步骤
        nodeList.forEach(function (domElement) {
            let textNodes = Vue.scan(domElement).textNodeList;

            textNodes.forEach(function (textElement) {
                Vue.parseTextNode(textElement, data);
            });
        });
    }

//找到el选择器对应的元素,返回一个DOM列表
    Vue.qsa = function(selector, parentNode = document) {
        return parentNode.querySelectorAll(selector);
    }

//根据DOM元素去递归遍历节点
    Vue.scan = function(node, textNodeList = [], otherNodeList = []) {

        checkNode(node, textNodeList, otherNodeList);

        //把文本节点保存到一个数组里，其他的放到另一个数组里
        function checkNode(node, textNodeList, otherNodeList) {
            if (node.nodeType === 3) {
                textNodeList.push(node);
            } else {
                otherNodeList.push(node);
            }
        }

        for (let index = node.childNodes.length - 1; index >= 0; index--) {
            Vue.scan(node.childNodes[index], textNodeList, otherNodeList);
        }

        //找到了文本和其它2类节点，针对任务中的问题，先处理文本节点
        return {textNodeList, otherNodeList};
    }

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

    window.Vue = Vue;
}(window));



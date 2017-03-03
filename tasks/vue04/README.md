#数据绑定04

##任务要求
1. 这一题是根据自己的Vue对象渲染html，把模板字符串里的变量用对象里的值替代。

##实现思路
1. el里保存的是选择器字符串，通过选择器字符串来找对应的DOM元素，这一个很好实现，直接用QSA即可；
2. 问题的关键在于parseHtml这一步，首先根据找到的DOM元素进行遍历，
然后解析html字符串，这一点可以用正则实现,
最后替换对应的变量。
3. 题目不要求动态数据绑定，和前面的关联程度不大，因此先写一个静态的Vue构造函数。

##实现过程
1. 首先根据选择器寻找dom元素
```javascript
    function qsa(selector, parentNode = document) {
        return parentNode.querySelectorAll(selector);
    }
    //返回的是一个dom元素列表
```
2. 接下来是根据被挂载的dom元素，递归遍历，寻找所有的子节点，把文本节点和其他节点分别保存到2个数组内
```javascript
function scan(node, textNodeList = [], otherNodeList = []) {

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
        scan(node.childNodes[index], textNodeList, otherNodeList);
    }

    //找到了文本和其它2类节点，针对任务中的问题，先处理文本节点
    return {textNodeList, otherNodeList};
}

```
3. 把文本节点mustache语法里面的内容替换为data数据里面的内容
* 在vue中，主要有针对文本节点的mustache语法和针对标签节点的自定义属性语法；
* parseHtml是一项复杂的工程，根据任务内容，这次只实现文本节点的mustache语法。
```javascript
function parseTextNode(textNode, data) {
    let txt = textNode.nodeValue;

    //用正则找到mustache语法里面的内容
    txt = txt.replace(/\{\{(\S+)\}\}/g, function (res, $1) {
        //暂时只考虑点语法
        let tokenArray = $1.trim().split('.');

        let _data = data;

        for (let token of tokenArray) {
            _data = _data[token];
        }
        return _data.toString();
    });
    textNode.nodeValue = txt;
}
```
4. 整合之前的方法
```javascript
function parseHtml(selector, data) {
    let nodeList = qsa(selector);

    //这是文本处理的步骤
    nodeList.forEach(function (domElement) {
        let textNodes = scan(domElement).textNodeList;

        textNodes.forEach(function (textElement) {
            parseTextNode(textElement, data);
        });
    });
}
```
5. 构造Vue函数
```javascript
function Vue(object) {
    parseHtml(object.el, object.data);
}
```

##总结
1. 这次的任务很有挑战性，一开始纠结于之前的代码，后面决定把这次需求单独抽象出来实现，思路一下子开朗了很多。
2. 为了mustache语法，特定去看了mustache.js的源码，发现自己在正则这一块欠缺的还很多，需要恶补。
3. 下一个任务就是动态绑定了，fighting。



/**
 * Created by xzywww on 2017-03-01.
 */
(function (window) {
    function Vue(object) {
        parseHtml(object.el, object.data);
    }

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

//找到el选择器对应的元素,返回一个DOM列表
    function qsa(selector, parentNode = document) {
        return parentNode.querySelectorAll(selector);
    }

//根据DOM元素去递归遍历节点
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

    function parseTextNode(textNode, data) {
        let txt = textNode.nodeValue;

        //用正则找到mustache语法里面的内容
        txt = txt.replace(/\{\{(\S+)\}\}/g, function (res, $1) {
            console.log('我找到了');
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

    window.Vue = Vue;
}(window))

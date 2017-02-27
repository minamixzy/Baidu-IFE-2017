/**
 * Created by xzywww on 2017-02-27.
 */
let app1 = new Observer({
    name: 'youngwind',
    age: 25
});

let app2 = new Observer({
    university: 'bupt',
    major: 'computer'
});

//把this.data改造成一哥特殊的对象
function Observer(obj) {
    //对外提供的访问接口
    this.data = new Object();

    //实际数据保存在这里
    this._data = new Object();
    let that = this;

    //循环遍历传入的对象
    for (let key of Object.keys(obj)) {
        //赋值操作
        this._data[key] = obj[key];

        //修改get和set方法
        Object.defineProperty(this.data, key, {
            get(){
                console.log('你访问了 ' + key);
                return that._data[key];
            },
            set(newVal){
                console.log('你设置了 ' + key + ' 新的值为 ' + newVal);
                that._data[key] = newVal;
                return that._data[key];
            }
        });
    }
}
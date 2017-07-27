;
(function(window, undefined) {

    var ensure = function(obj, name, factory) {
        return obj[name] || (obj[name] = factory());
    };
    /*
     *   创建Storage对象
     *   typespace { string } 缓存类型
     */
    var createStorage = function(typespace) {
        var StorageInstance = {
            type: (!!typespace ? typespace : "session") + "Storage", //local本地存储，session会话存储
            /*
             *   保存缓存，页面回话打开期间有效
             *   @key {String} 键
             *   @val {String} 值
             *   @expTime {int} 过期时间，不设置为不过期
             */
            set: function(key, val, expTime) {
                var data = {
                    "ExpirationTime": !!expTime && expTime, //按小时计算
                    "SetTime": new Date().toString(),
                    "Value": val
                };
                val = JSON.stringify(data);
                if (Object.prototype.toString.call(val) != "[object String]") throw "'key' is not string！";
                //各浏览器支持的 localStorage 和 sessionStorage 容量上限不同。
                //如果达到上限则删除第一个键重新保存
                try {
                    window[this.type].setItem(key, val);
                } catch (e) {
                    this.shift();
                    this.set(key, val);
                }
            },
            /*
             *   获取键的值
             *   @key { string } 键名称
             */
            get: function(key) {
                var str = window[this.type].getItem(key),
                    data = JSON.parse(str),
                    expTime = data.ExpirationTime,
                    setTime = new Date(data.SetTime);
                if (!!expTime && typeof expTime == "number") {
                    var nowTime = new Date();
                    if (Math.abs(parseInt(setTime - nowTime) / 1000 / 60 / 60) > expTime) {
                        console.log("缓存已过期!");
                        return null;
                    }
                    return data.Value;
                }
                return data.Value;
            },
            /*
             *   获取第n个键的值
             *   index { int } 位置
             */
            key: function(index) {
                var str = window[this.type].key(index),
                    data = JSON.parse(str);
                return data.Value;
            },
            /*
             *   删除指定key值
             *   @key {String} 键名称
             */
            del: function(key) {
                window[this.type].removeItem(key);
            },
            //返回StorageStorage对象
            getStorage: function() {
                return window[this.type];
            },
            //删除当前第一个StorageStorage对象的键
            shift: function() {
                this.del(window[this.type].key(0));
            }
        };

        return StorageInstance;
    }

    ensure(window, "Store", function() {
        /*
         *   local本地存储，session会话存储
         *   typespace {String} local,session
         */
        var outStore = function(typespace) {
            return new createStorage(typespace);
        }
        return outStore;
    });

})(window);
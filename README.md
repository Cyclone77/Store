### Storage 缓存处理

- 2017年7月27日 11:48:17 增加设置缓存（type = 'local'）设置时间

``` javascript
Store("local").set("Name", "Cy"); //设置key
Store("local").set("Name", "Cy", 1); //设置过期时间的key
console.log(Store("local").get("Name"));
```
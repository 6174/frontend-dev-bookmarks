淘宝的短信安全验证
=====

今天遇到的一个问题是需要实现一个二次验证的弹出窗口， 这个弹出窗口其实是一个iframe， 使用方法
为使用调用AQPop对象, 代码如下：

```JavaScript
var AQPop = window.AQPop;
var obj = new AQPop({
            title: '下单验证',
            style: 'durex',
            type: 'dialog',
            width: 320,
            height: 280
        });

obj.on('close', function() {
    obj.hide();
});

//验证成功或者失败的回调方法
AQPop.addMethod({
    success: function() {
        obj.hide();
        submit({
            durex: 1
        });
    },
    cancel: function() {
        obj.hide();
    }
});

obj.render({
            url: url,
            redirectURL: ''
        });
obj.show();

```
-----

惊呆了， 为何如此神奇， 安全验证那么简单， 而且还能实现， 通过AQPop.addMethod来为AQPop注册方法。  
如何实现的呢？
 
下面我们来分析一下， 首先看一下AQPop做了些什么东西，查看源码， 有这样的注释：

```
 /*     url[String]:iframe URL
 *      redirectURL[String]:跳转URL，encode后会作为redirecturl参数拼接在url上，当然亦可
 *          直接写入url，如http://xx.com/?redirecturl=redirectURL
 */
```

重点就是这个url， AQPop做的事情实际上就是一个中介， 实现一个平台， 弹出层的所有样式， 代理success方法， cancel方法， 自己也有一些关于弹出测层的hide和show方法。  AQPop添加了一个iframe， 将src设置成了， 安全验证的durex页面， 这个页面就是获取短信验证码的页面， 那如何实现短信验证成功调用success方法呢？   这就是重点了。

AQPop的参数url后边添加了一个redirectURL， 这个redirectURL所在的页面就是实现调用的关键所在， 这个redirectURL和当前页面是在同意域名下边的， 设置iframe的时候， iframe里边如果发现短信验证成功了， 那么就将页面刷新 window.location = redirectURL...

redirectURL 的页面内容其实很简单 就是调用 top.AQPop.success 方法, top就是顶级父窗口， 这样就是先跨域了！

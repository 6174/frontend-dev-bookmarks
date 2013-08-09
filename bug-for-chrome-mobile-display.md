## 开发中遇到的一个小问题
====

`解释`： 在chrome-mobile下面， 和chrome-desktop下面表现不一致， 需求是写一个css3动画， 通过给元素增加 className 来选择动画， 动画就是通过css来写的了！ 其实就是加了一个transition-duration.
添加了 classname 过后监听transitionEnd事件， 处理函数为将一部分div display none， 一部分display block。  但是神奇的效果出现了， 在chrome-mobile下面， 设置为block的， 一下子就出现了， 没有经过动画， 在desktop下面表现正常（在第一次执行动画过程的时候表现正常的， 后面就不正常了）； 其他移动浏览器也表现正常！ 最终实在没有办法， 直接不用display了---

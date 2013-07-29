##debug for chrome android broswer
===
0. chrome for android and desktop 
1. 打开[这里](https://developers.google.com/chrome-developer-tools/docs/remote-debugging)
2. 应用商店中下载ADBPlugin for desktop
3. 配置adb
4. 设置chrome for android 允许usb调试，(系统设置那个按钮就是chrome的设置按钮)
5. adb forward tcp:9222 localabstract:chrome_devtools_remote
6. 浏览器中打开localhost:9222
7. 可以看到android chrome上打开的页面选项， 点击， 无法进入？对的！
8. 修改hosts文件， windows在C:\Windows\System32\drivers\etc， linux再/etc/hosts中
9. 添加203.208.46.178 chrome-devtools-frontend.appspot.com
10. 再点击， ok了， enjoy



function FindProxyForURL(url, host) {
	if (host == "assets.daily.taobao.net" ||
		host == "assets.daily.tmall.net" ||
		host == "assets.demo.taobao.net" ||
		host == "assets.demo.tmall.net" ||
		host == "assets.local.taobao.net" ||
		host == "assets.local.tmall.net" ||
		host == "a.tbcdn.cn" ||
		host == "l.tbcdn.cn") {
		return "PROXY localhost:80";
	}
	if (host == "g.assets.daily.taobao.net" ||
		host == "g.tbcdn.cn" ||
		host == "localhost.tmall.net" ||
		host == "khc.taobao.net" ||
		host == "local.khc.net" ||
		host == "g.assets.daily.taobao.net") {
		return "PROXY localhost:80";
	}
	return "DIRECT";
}

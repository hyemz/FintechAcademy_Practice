var http = require("http");

http.createServer(function (req, res) {
	var body = "hello Server";
	res.setHeader('Content-Type', 'text/html; charset=utf-8');
	res.end("안녕하세요")
}).listen(3001);

console.log("서버가 실행중!");

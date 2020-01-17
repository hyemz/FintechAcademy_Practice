//동기식 (1324)
//파일을 불러오는데 시간이 걸리기 때문에 늦게 처리가 됨
var fs = require('fs');

console.log("첫기능이래요");
fs.readFile('example/test.txt', 'utf8', function(err,result) {
    if(err) {
        console.error(err);
        throw err;
    }
    else {
        console.error("두번째 기능인데 오래걸린대요.");
        console.log(result);
    }
});

console.log("후 드디어 마지막이네");
var fs = require('fs');

function callbackFunc(callback) {
    fs.readFile('example/test.txt', 'utf8', function (err, result) {
        if(err) {
            console.error(err);
            throw err;
        }
        else {
            console.error("두번짼대 왜?");
            callback(result);
        }
    });
}

console.log("A");
callbackFunc(function (data) {
    console.log(data);
    console.log("C");
})
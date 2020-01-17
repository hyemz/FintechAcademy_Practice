var ceaser = require('./ceaserChiper');
var md5 = require('md5');

console.log(ceaser.encrypt(3,'hi how are you i am fine'));
console.log(ceaser.decrypt(3, 'kl krz duh brx l dp ilqh'));

console.log(md5('A가 B 에게 10만원을 전송함'));

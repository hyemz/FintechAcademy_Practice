const express = require('express')
const app = express()
 
app.get('/', function (req, res) {
  res.send('오늘 점심은 계란 샌드위치~')
})

//라우터 추가하면 기존 주소에 라우터 써주면 들어가짐
app.get('/router@1', function (req, res) {
	res.send('오늘 저녁은 뭐먹어?')
  })
 
app.listen(3000)
console.log("zlzl e됐다구");
var express = require("express"),
  app = express();
var port = process.env.PORT || 3000;
var request = require("request");
var jwt = require("jsonwebtoken");
var tokenKey = "tokenisveryeasy";
var auth = require("./lib/auth");

//정보를 공개할 것인지 아닌지
app.use(express.static(__dirname + "/public"));
//view파일이 어디에 위치해 있는지
app.set("views", __dirname + "/views");
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", function(req, res) {
  res.render("index");
});

app.get("/hoho", function(req, res) {
  res.render("test");
});
app.get("/qrReader", function(req, res) {
  res.render("qrReader");
});
app.get("/testAuth", auth, function(req, res) {
  res.json("로그인 된 사용자입니다.");
});

var mysql = require("mysql");
var connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "fintech",
  port: "8889"
});

connection.connect();

app.get("/", function(req, res) {
  res.render("index");
});
app.get("/signup", function(req, res) {
  res.render("signup");
});
app.get("/login", function(req, res) {
  res.render("login");
});

app.get("/main", function(req, res) {
  res.render("main");
});

app.get("/balance", function(req, res) {
  res.render("balance");
});
app.get("/transactionList", function (req, res) {
  res.render("transactionList");
})

app.get("/qrcode", function(req, res) {
  res.render("qrcode");
})
app.get("/withdraw", function(req, res) {
  res.render("withdraw");
})

app.get("/authResult", function(req, res) {
  var authCode = req.query.code;
  console.log(authCode);
  var option = {
    method: "POST",
    url: "https://testapi.openbanking.or.kr/oauth/2.0/token",
    headers: "",
    form: {
      code: authCode,
      client_id: "A7yqbGmzvutk9aktFXkKwXRtpwKbltbI1VQ2RhD8",
      client_secret: "Gez4Vhcq2HLLwEe35O8ZkaiJlYA2uRAqYdhp9pDi",
      redirect_uri: "http://localhost:3000/authResult",
      grant_type: "authorization_code"
    }
  };
  request(option, function(error, response, body) {
    console.log(body);
    var accessRequestResult = JSON.parse(body);
    res.render("resultChild", { data: accessRequestResult });
  });
});

app.get("/dbtofront", function(req, res) {
  connection.query("SELECT * FROM test", function(error, results, fields) {
    if (error) throw error;
    console.log("The result is: ", results);
    res.json(results);
  });
}); /*post기능*/

app.post("/user", function(req, res) {
  console.log(req.body);
  var name = req.body.name;
  var password = req.body.password;
  var email = req.body.email;
  var accessToken = req.body.accessToken;
  var refreshToken = req.body.refreshToken;
  var userSeqNo = req.body.userSeqNo;

  var sql =
    "INSERT INTO fintech.test (name, email, password, accesstoken, refreshtoken, userseqno) VALUES (?, ?, ?, ?, ?, ?)";
  // SQL 구문 변경 DB 구조 확인 바람
  connection.query(
    sql,
    [name, email, password, accessToken, refreshToken, userSeqNo],
    function(error, results, fields) {
      if (error) throw error;
      console.log("The result is: ", results);
      console.log("sql is", this.sql);
      res.json(1);
    }
  );
});

app.post("/accountList", auth, function(req, res) {
  var userData = req.decoded;
  var sql = "SELECT * FROM user WHERE id = ?";
  connection.query(sql, [userData.userId], function(err, result) {
    if (err) {
      console.error(err);
      throw err;
    } else {
      var option = {
        method: "get",
        url: "https://testapi.openbanking.or.kr/v2.0/account/list",
        headers: {
          Authorization: "Bearer " + result[0].accesstoken
        },
        qs: {
          user_seq_no: result[0].userseqno,
          include_cancel_yn: "Y",
          sort_order: "D"
        }
      };
      request(option, function(error, response, body) {
        console.log(body);
        var parseData = JSON.parse(body);
        res.json(parseData);
      });
    }
  });
});

app.post("/transactionList", auth, function(req, res) {
  var userData = req.decoded;
  var finusenum = req.body.fin_use_num;
  var sql = "SELECT * FROM user WHERE id = ?";
  connection.query(sql, [userData.userId], function(err, result) {
    if (err) {
      console.error(err);
      throw err;
    } else {
      console.log(result);
      var countnum = Math.floor(Math.random() * 1000000000) + 1;
      var transId = "T991605210U" + countnum;
      var option = {
        method: "get",
        url: "https://testapi.openbanking.or.kr/v2.0/account/transaction_list/fin_num",
        headers: {
          Authorization: "Bearer " + result[0].accesstoken
        },
        qs: {
          bank_tran_id: transId,
          fintech_use_num: finusenum,
          inquiry_type: "A",
          inquiry_base:'D',
          from_date: '20160404',
          to_date:'20200110',
          sort_order: 'D', 
          tran_dtime: '20200110101921'
        }
      };
      request(option, function(error, response, body) {
        console.log(body);
        var parseData = JSON.parse(body);
        res.json(parseData);
      });
    }
  });
});

app.post("/withdraw", auth, function(req, res) {
  var userData = req.decoded;
  var finusenum = req.body.fin_use_num;
  var sql = "SELECT * FROM user WHERE id = ?";
  connection.query(sql, [userData.userId], function(err, result) {
    if (err) {
      console.error(err);
      throw err;
    } else {
      console.log(result);
      var countnum = Math.floor(Math.random() * 1000000000) + 1;
      var transId = "T991605210U" + countnum;
      var option = {
        method: "post",
        url: "https://testapi.openbanking.or.kr/v2.0/transfer/withdraw/fin_num",
        headers: {
          'Content-Type' : 'application/json; charset=UTF-8',
          Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiIxMTAwNzUyNTk0Iiwic2NvcGUiOlsiaW5xdWlyeSIsImxvZ2luIiwidHJhbnNmZXIiXSwiaXNzIjoiaHR0cHM6Ly93d3cub3BlbmJhbmtpbmcub3Iua3IiLCJleHAiOjE1ODYxNDczNjgsImp0aSI6IjNhMzJmMDk2LTIwZTYtNDNlMy1hODdiLTA2Y2Y5ZGNkNGU4NiJ9.YRP51jyTPjOXjhqWn9MMndrY7fupTS9Y6gSX68RD82M"
        },
        json: {
          bank_tran_id: transId,
          cntr_account_type: "N",
          cntr_account_num: "3254097665",
          dps_print_content: "쇼핑몰환불",
          fintech_use_num: finusenum,
          tran_amt: "1000",
          tran_dtime: "20190910101921",
          req_client_name: "홍길동",
          req_client_bank_code: "004",
          req_client_account_num: "1992563777524",
          req_client_num: "HONGGILDONG1234",
          transfer_purpose: "TR",
          sub_frnc_name: "하위가맹점",
          sub_frnc_num: "123456789012",
          sub_frnc_business_num: "1234567890",
          recv_client_name: "김오픈",
          recv_client_bank_code: "097",
          recv_client_account_num: "232000067812"
        }
      };
      request(option, function (error, response, body) {
        console.log(body);
        var resultObject = body;
        if(resultObject.rsp_code == "A0000"){
            res.json(1);
        } 
        else {
            res.json(resultObject.rsp_code)
        }

    });
    }
  });
});

app.post("/login", function(req, res) {
  var email = req.body.email;
  var userPassword = req.body.password;
  var sql = "SELECT * FROM user WHERE email = ?";
  connection.query(sql, [email], function(error, results, fields) {
    if (error) throw error;
    console.log(results[0].password, userPassword);
    if (results[0].password == userPassword) {
      //jwt는 우리 서비스에 대한 토큰을 인증해주는 것 (금융위와는 조금 다르다)
      jwt.sign(
        {
          userName: results[0].name,
          userId: results[0].id,
          userEmail: results[0].email
        },
        tokenKey,
        {
          expiresIn: "90d",
          issuer: "fintech.admin",
          subject: "user.login.info"
        },
        function(err, token) {
          console.log("로그인 성공", token);
          res.json(token);
        }
      );
    } else {
      console.log("비밀번호 틀렸습니다.");
    }
  });
});

app.post("/balance", auth, function(req, res) {
  var userData = req.decoded;
  var finusenum = req.body.fin_use_num;
  var sql = "SELECT * FROM user WHERE id = ?";
  connection.query(sql, [userData.userId], function(err, result) {
    if (err) {
      console.error(err);
      throw err;
    } else {
      console.log(result);
      var countnum = Math.floor(Math.random() * 1000000000) + 1;
      var transId = "T991605210U" + countnum;
      var option = {
        method: "get",
        url: "https://testapi.openbanking.or.kr/v2.0/account/balance/fin_num",
        headers: {
          Authorization: "Bearer " + result[0].accesstoken
        },
        qs: {
          bank_tran_id: transId,
          fintech_use_num: finusenum,
          tran_dtime: "20200108145630"
        }
      };
      request(option, function(error, response, body) {
        console.log(body);
        var parseData = JSON.parse(body);
        res.json(parseData);
      });
    }
  });
});

app.listen(port);
console.log("Listening on port ", port);

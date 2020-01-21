//pm2 start main.js --watch --ignore-watch="data/*"

const express = require('express'); // 모듈을 불러온다.
const app = express();  //application을 얻는 방법
const port = 3000;
var fs = require('fs'); 
var bodyParser = require('body-parser');
var compression = require('compression');
var topicRouter = require('./routes/topic');
var indexRouter = require('./routes/index');
// 기본적인 보안 문제들을 해결해주는 미들웨어
var helmet =require('helmet');
app.use(helmet()); 

// 해당 코드가 실행 되면 미들웨어가 실행된다.
app.use(express.static('public'));// 정적인 파일을 직접지정해준다. 지정하지 않은 부분은 접근할 수 없다. 
// express 내장 static 파일을 불러오는 미들웨어
app.use(bodyParser.urlencoded({extended:false}));
app.use(compression());
// 미들웨어는 함수이다.
// 함수는 첫번째 매개변수는  request 객체 인자로
// 두번째 매개변수는  reponse 객체 인자로
// get방식의 요청만 파일 목록을 가져온다.
// 라우팅이 사실 미들웨어였다... 모든게 미들웨어이다 
app.get('*', function (request, reponse, next){
  fs.readdir('./data', function(error, filelist){
    request.flist =filelist;
    next();// next에는 다음에 호출될 미들웨어가 담겨있다.
  });
});

app.use('/',indexRouter);

//  '/topic'으로 시작하는 주소들에게 topicRouter라는 미들웨어를 적용한다.
app.use('/topic',topicRouter);

//2개 이상 parameter 주는 경우
/*
app.get('/page/:pageId/:chapterid', function(request, res) {
  return res.send(request.params.pageId);
});
*/

//맨 마지막에 미들웨어를 추가한다.
//다른 곳에 라우팅 되다가 여기까지 라우팅이 안되면 없는 페이지로 처리한다.
app.use(function(req, res, next)
{
  res.status(404).send('Sorry cannot find that ! ');
});

//에러 발생 시 next의 인자로 err를 준 경우 다른 것들 다무시하고 여기로 빠지게 된다.
app.use(function(err, req,  res, next)
{
  console.error(err.stack)
  res.status(500).send('Something broke!');
});

// 3000포트에 리스팅 한다.
// app.listen이랑 동일한 역할을 한다.
//app.listen(port, () => console.log(`Example app listening on port ${port}!`))
app.listen(port, function() {
  console.log(`404 : Example app listening on port ${port}!`)
})


/*

var http = require('http');
var fs = require('fs');
var url = require('url');

var template = require('./lib/template.js');
var path = require('path');
var sanitizeHtml = require('sanitize-html');

var app = http.createServer(function(request,response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var pathname = url.parse(_url, true).pathname;
    if(pathname === '/'){
      if(queryData.id === undefined){
      } else {
      } 
    }
     else if(pathname === '/create'){
      
    } else if(pathname === '/create_process'){
      
    } else if(pathname === '/update'){
     
    } else if(pathname === '/update_process'){
     
    } else if(pathname === '/delete_process'){
      var body = '';
      request.on('data', function(data){
          body = body + data;
      });
      request.on('end', function(){
          var post = qs.parse(body);
          var id = post.id;
          var filteredId = path.parse(id).base;
          fs.unlink(`data/${filteredId}`, function(error){
            response.writeHead(302, {Location: `/`});
            response.end();
          })
      });
    } else {
      response.writeHead(404);
      response.end('Not found');
    }
});
app.listen(3000);
*/
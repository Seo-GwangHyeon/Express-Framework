const express = require('express'); // 모듈을 불러온다.
const app = express();  //application을 얻는 방법
const port = 3000;
var fs = require('fs');
var template = require('./lib/template.js');
var path = require('path');
var sanitizeHtml = require('sanitize-html');
var qs = require('querystring');
var bodyParser = require('body-parser');

// 해당 코드가 실행 되면 미들웨어가 실행된다.
app.use(bodyParser.urlencoded({extended:false}));


// get은 rounte, routing =>  어떤 길을 따라서 갈림길에서 적당한 곳으로 방향을 잡는 것, 즉 사용자들이 
//여러 경로를 통해서 들오면 적절히 바꿔 주는 것
//app.get('/', (req, res) => res.send('Hello World!'))//  
app.get('/', function(request, response) {
  fs.readdir('./data', function(error, filelist){
    var title = 'Welcome';
    var description = 'Hello, Node.js';
    var list = template.list(filelist);
    var html = template.HTML(title, list,
      `<h2>${title}</h2>${description}`,
      `<a href="/create">create</a>`
    );
    response.send(html);
  });
});
// 사용자가 주는 어떤 값에다가 pageId를 할당한다.
// url path 방식으로 parameter를 전달하는 것을 처리하는 라우팅 기법을 배움
app.get('/page/:pageId', function(request, response) {
  fs.readdir('./data', function(error, filelist){
    var filteredId = path.parse(request.params.pageId).base;
    fs.readFile(`data/${filteredId}`, 'utf8', function(err, description){
      var title = request.params.pageId;
      var sanitizedTitle = sanitizeHtml(title);
      var sanitizedDescription = sanitizeHtml(description, {
        allowedTags:['h1']
      });
      var list = template.list(filelist);
      var html = template.HTML(sanitizedTitle, list,
        `<h2>${sanitizedTitle}</h2>${sanitizedDescription}`,
        ` <a href="/create">create</a>
          <a href="/update/${sanitizedTitle}">update</a>
          <form action="/delete_process" method="post">
            <input type="hidden" name="id" value="${sanitizedTitle}">
            <input type="submit" value="delete">
          </form>`
      );
      response.send(html);
    });
  });
});

app.get('/create', function(request, response) {
  fs.readdir('./data', function(error, filelist){
    var title = ' create';
    var list = template.list(filelist);
    var html = template.HTML(title, list, `
      <form action="/create_process" method="post">
        <p><input type="text" name="title" placeholder="title"></p>
        <p>
          <textarea name="description" placeholder="description"></textarea>
        </p>
        <p>
          <input type="submit">
        </p>
      </form>
    `, '');
    response.send(html);
  });
});
// 포스트 방식이ㄹ면 이렇게 동작 
app.post('/create_process', function(request, response) {  
  var post = request.body;  //body-parser를 사용해서 새로 생긴 property
  var title = post.title;
  console.log(post.title);
  var description = post.description;
  fs.writeFile(`data/${title}`, description, 'utf8', function(err){
    response.redirect(`/page/${title}`);
  })
});
//프래틱 URL, Clean URL
app.get('/update/:pageId', function(request, response) {
  fs.readdir('./data', function(error, filelist){
    var filteredId = path.parse(request.params.pageId).base;
    fs.readFile(`data/${filteredId}`, 'utf8', function(err, description){
      var title =request.params.pageId;
      var list = template.list(filelist);
      var html = template.HTML(title, list,
        `
        <form action="/update_process" method="post">
          <input type="hidden" name="id" value="${title}">
          <p><input type="text" name="title" placeholder="title" value="${title}"></p>
          <p>
            <textarea name="description" placeholder="description">${description}</textarea>
          </p>
          <p>
            <input type="submit">
          </p>
        </form>
        `,
        `<a href="/create">create</a> <a href="/update/${title}">update</a>`
      );
      response.send(html);
    });
  });
});

// 포스트 방식이ㄹ면 이렇게 동작 
app.post('/update_process', function(request, response) {
  var post = request.body;
  var id = post.id;
  var title = post.title;
  var description = post.description;
  fs.rename(`data/${id}`, `data/${title}`, function(error){
    fs.writeFile(`data/${title}`, description, 'utf8', function(err){
      response.redirect( `/page/${title}`);
    })
});
});

app.post('/delete_process',function(request,response){
  var post = request.body;
  var id = post.id;
  var filteredId = path.parse(id).base;
  fs.unlink(`data/${filteredId}`, function(error){
    response.redirect(`/`);
  })
});


//2개 이상 parameter 주는 경우
/*
app.get('/page/:pageId/:chapterid', function(request, res) {
  return res.send(request.params.pageId);

});
*/


// 3000포트에 리스팅 한다.
// app.listen이랑 동일한 역할을 한다.
//app.listen(port, () => console.log(`Example app listening on port ${port}!`))
app.listen(port, function() {
  console.log(`Example app listening on port ${port}!`)
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
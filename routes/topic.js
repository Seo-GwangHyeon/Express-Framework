//파일로 라우터를 분리하기 위해 필요한 함수들

var express = require('express');
var router = express.Router();

var path = require('path');
var fs = require('fs');
var sanitizeHtml = require('sanitize-html');
var template = require('../lib/template.js');

router.get('/create', function(request, response) {
    var title = ' create';
    var list = template.list(request.flist);
    var html = template.HTML(title, list, `
      <form action="/topic/create_process" method="post">
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
  
  // 포스트 방식이면 이렇게 동작 
  router.post('/create_process', function(request, response) {  
    var post = request.body;  //body-parser를 사용해서 새로 생긴 property
    var title = post.title;
    console.log(post.title);
    var description = post.description;
    fs.writeFile(`data/${title}`, description, 'utf8', function(err){
      response.redirect(`/topic/${title}`);
    })
  });
  //프래틱 URL, Clean URL
  router.get('/update/:pageId', function(request, response) {
   
        var filteredId = path.parse(request.params.pageId).base;
        fs.readFile(`data/${filteredId}`, 'utf8', function(err, description){
        if(err)
        {
          console.log('WHAT THE FUCK !!!!!');
          next(err);// 해당 파일이 없을시  다음 미들웨어로 넘긴다. 그래서 404 페이지로 간다.
        }
        else
        {
          var title =request.params.pageId;
          var list = template.list(request.flist);
          var html = template.HTML(title, list,
            `
            <form action="/topic/update_process" method="post">
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
            `<a href="/topic/create">create</a> <a href="/topic/update/${title}">update</a>`
          );
        
        
          response.send(html);
        }
      });
  });
  
  // 포스트 방식이ㄹ면 이렇게 동작 
  router.post('/update_process', function(request, response) {
    var post = request.body;
    var id = post.id;
    var title = post.title;
    var description = post.description;
    fs.rename(`data/${id}`, `data/${title}`, function(error){
      fs.writeFile(`data/${title}`, description, 'utf8', function(err){
        response.redirect( `/topic/${title}`);
      })
  });
  });
  
  router.post('/delete_process',function(request,response){
    var post = request.body;
    var id = post.id;
    var filteredId = path.parse(id).base;
    fs.unlink(`data/${filteredId}`, function(error){
      response.redirect(`/`);
    })
  });
  
  
  // 사용자가 주는 어떤 값에다가 pageId를 할당한다.
  // url path 방식으로 parameter를 전달하는 것을 처리하는 라우팅 기법을 배움
  router.get('/:pageId', function(request, response,next) {
    console.log(request.list)
    var filteredId = path.parse(request.params.pageId).base;
    fs.readFile(`data/${filteredId}`, 'utf8', function(err, description){
      if(err)
      {
        next(err);// 해당 파일이 없을시  다음 미들웨어로 넘긴다. 그래서 404 페이지로 간다.
      }
      else{
        var title = request.params.pageId;
        var sanitizedTitle = sanitizeHtml(title);
        var sanitizedDescription = sanitizeHtml(description, {
          allowedTags:['h1']
        });
        var list = template.list(request.flist);
        var html = template.HTML(sanitizedTitle, list,
          `<h2>${sanitizedTitle}</h2>${sanitizedDescription}`,
          ` <a href="/topic/create">create</a>
            <a href="/topic/update/${sanitizedTitle}">update</a>
            <form action="/topic/delete_process" method="post">
              <input type="hidden" name="id" value="${sanitizedTitle}">
              <input type="submit" value="delete">
            </form>`
        );
        response.send(html);
        
      }
      
    });
    
});
  

module.exports=router;
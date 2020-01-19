
var express = require('express');
var router = express.Router();

var template = require('../lib/template.js');

// get은 rounte, routing =>  어떤 길을 따라서 갈림길에서 적당한 곳으로 방향을 잡는 것, 즉 사용자들이 
//여러 경로를 통해서 들오면 적절히 바꿔 주는 것
//app.get('/', (req, res) => res.send('Hello World!'))//  
router.get('/', function(request, response) {
    var title = 'Welcome';
    var description = 'Hello, Node.js';
    var list = template.list(request.flist);
    var html = template.HTML(title, list,
      `<h2>${title}</h2>${description}
      <img src="/img/kakao.jpg" style="width:100px;  display:block; margin-top:10px;" >
      `
      ,
      `<a href="/topic/create">create</a>`

    );
    response.send(html);
});

module.exports=router;
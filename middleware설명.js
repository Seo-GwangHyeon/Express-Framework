app.use('/user/:id'), function (req, res,next){

    console.log('Request URL:'), req.originUrl);
    if(req.params.id==='0') next('route')// 다음 route 의 미들웨어를 실행
    next() // 바로 다음 아래의 미들웨어 호출
}, function (req, res, next){
    console.log('Request URL:'), req.originUrl);
    next()
}

})

app.use('/user/:id'), function (req, res,next){
    console.log('some special'), );
})


var http = require('http');
var url = require('url');
var topic = require('./lib/topic'); // topic 기능 호출
var author = require('./lib/author'); 

var app = http.createServer(function (request, response) {
	var _url = request.url;
	var queryData = url.parse(_url, true).query;
	var pathname = url.parse(_url, true).pathname;

	if (pathname === '/') { // 메인화면 경로
		if (queryData.id === undefined) { // 메인화면
			topic.home(request, response);
		} else {
			topic.detail(request, response); // 상세화면
		}
	} else if (pathname === '/create') { // 등록화면
		topic.create(request, response);
	} else if (pathname === '/create_process') { // 등록
		topic.create_process(request, response);
	} else if (pathname === '/update') { // 수정화면
		topic.update(request, response);
	} else if (pathname === '/update_process') { // 수정
		topic.update_process(request, response);
	} else if (pathname === '/delete_process') { // 삭제
		topic.delete_process(request, response);
	} else if(pathname === '/author') { // 저자 화면
		author.home(request, response);
	} else if(pathname === '/author/create_process') { // 저자 등록
		author.create_author_process(request, response);
	} else if(pathname === '/author/update') { // 저자 수정
		author.update(request, response);
	} else {
		topic.notFound(request, response); // not found
	}
});
app.listen(3000);
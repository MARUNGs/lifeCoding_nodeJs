var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');

// 공통 템플릿 함수 생성
function templateHTML(title, list, body, control) {
  return `
  <!doctype html>
  <html>
  <head>
    <title>WEB - ${title}</title>
    <meta charset="utf-8">
  </head>
  <body>
    <h1><a href="/">WEB</a></h1>
    ${list}
    ${control}
    ${body}
  </body>
  </html>    
  `;
}

function templateList(fileList) {
  // 공통 li 반복문
  var list = '<ul>';
  var i = 0;
  while(i < fileList.length) {
    list = list + `<li><a href="/?id=${fileList[i]}">${fileList[i]}</a></li>`;
    i += 1;
  }
  list += '</ul>';

  return list;
}

var app = http.createServer(function(request,response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var pathname = url.parse(_url, true).pathname;

    if(pathname === '/') {
      if(queryData.id === undefined) {
          fs.readdir('./data', function(error, fileList) {
            var title = 'Welcome';
            var description = 'Hello, Node.js';
            var list = templateList(fileList);
            var templete = templateHTML(title, 
                                        list, 
                                        `<h2>${title}</h2>${description}`, 
                                        `<a href="/create">create</a>`);
            response.writeHead(200);
            response.end(templete);
          });
      } else {
        fs.readdir('./data', function(error, fileList) {
          fs.readFile(`data/${queryData.id}`, 'utf8', function(err, description) {
            var title = queryData.id;
            var list = templateList(fileList);
            var templete = templateHTML(title, 
                                        list, 
                                        `<h2>${title}</h2>${description}`,
                                        `<a href="/create">create</a> <a href="/update?id=${title}">update</a>`);
            response.writeHead(200);
            response.end(templete);
          });
        });
      }
    } else if(pathname === '/create') {
      fs.readdir('./data', function(error, fileList) {
        var title = 'WEB - create';
        var list = templateList(fileList);
        var templete = templateHTML(title, list, `
          <form action="http://localhost:3000/create_process" method="post">
            <p>
              <input type="text" name="title" placeholder="title" />
            </p>
            <p>
              <textarea name="description" placeholder="description"></textarea>
            </p>
            <p>
              <input type="submit" />
            </p>
          </form>
        `, '');
        response.writeHead(200);
        response.end(templete);
      });
    } else if(pathname === '/create_process') {
      var body = '';

      // createServer의 콜백함수 내 매개변수 이용 request, response
      request.on('data', function(data) {
        body = body + data;
      }); 

      request.on('end', function() { // 더이상 들어 올 정보가 없으면 'end'의 콜백함수를 호출한다.
        var post = qs.parse(body); // 정보를 객체화할 수 있다.
        var title = post.title;
        var description = post.description;

        // 파일을 생성하고 작성하기
        fs.writeFile(`data/${title}`, description, 'utf8', function(err) {
          response.writeHead(301, { // 301 : 이 웹주소는 해당 주소로 지금 바뀌었습니다!
            location: `/?id=${title}`
          }); 
          response.end('success');
        });
      });
    } else {
      response.writeHead(404);
      response.end('Not found');
    }
});
app.listen(3000);
var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');
var template = require('./lib/template.js');
var path = require('path');
var sanitizeHtml = require('sanitize-html');
var mysql = require('mysql');
var db = mysql.createConnection({ // mysql 접속 설정
  host: 'localhost',
  user: 'root',
  password: '111111',
  database: 'opentutorials'
});
db.connect(); // 실제 접속

var app = http.createServer(function(request,response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var pathname = url.parse(_url, true).pathname;

    if(pathname === '/') {
      if(queryData.id === undefined) {
          db.query(`SELECT * FROM topic`, function(error, topics, fields) {
            var title = 'Welcome';
            var description = 'Hello, Node.js';
            var list = template.list(topics);
            var html = template.html(title, 
                                      list, 
                                      `<h2>${title}</h2>${description}`, 
                                      `<a href="/create">create</a>`);
            response.writeHead(200);
            response.end(html);
          });
      } else {
        db.query(`SELECT * FROM topic`, function(error, topics, fields) {
          if(error) { // 에러가 발생하면 error를 던지면서 애플리케이션을 중지시킨다.
            throw error;
          } 
          
          // [queryData.id]가 자동으로 '?'에 치환되어 삽입된다.
          db.query(`SELECT * FROM topic WHERE id=?`, [queryData.id], function(error2, topic) {
            if(error2) { // 중지시킴2
              throw error2;
            }

            var title       = topic[0].title;
            var description = topic[0].description;
            var list = template.list(topics);
            var html = template.html(title, list, 
                                      `<h2>${title}</h2>${description}`, 
                                      `<a href="/create">create</a>
                                      <a href="/update?id=${queryData.id}">update</a>
                                      <form action="/depete_process" method="post">
                                        <input type="hidden" name="id" value="${queryData.id}" />
                                        <input type="submit" value="delete" />
                                      </form>`
            );

            response.writeHead(200);
            response.end(html);
          });
        });
      }
    } else if(pathname === '/create') {
      fs.readdir('./data', function(error, fileList) {
        var title = 'WEB - create';
        var list = template.list(fileList);
        var html = template.html(title, list, `
          <form action="/create_process" method="post">
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
        response.end(html);
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
    } else if(pathname === '/update') {
      // ***** 기존 정보 수정하기
      fs.readdir('./data', function(error, fileList) {
        var filteredId = path.parse(queryData.id).base;
        fs.readFile(`data/${filteredId}`, 'utf8', function(err, description) {
          var title = queryData.id;
          var list = template.list(fileList);
          var html = template.html(title, 
                                  list, 
                                  `
                                  <form action="/update_process" method="post">
                                    <input type="hidden" name="id" value="${title}" />
                                    <p>
                                      <input type="text" name="title" placeholder="title" value="${title}"/>
                                    </p>
                                    <p>
                                      <textarea name="description" placeholder="description">${description}</textarea>
                                    </p>
                                    <p>
                                      <input type="submit" />
                                    </p>
                                  </form>
                                  `,
                                  `<a href="/create">create</a> <a href="/update?id=${title}">update</a>`);
          response.writeHead(200);
          response.end(html);
        });
      });
    } else if(pathname === '/update_process') {
      var body = '';

      // createServer의 콜백함수 내 매개변수 이용 request, response
      request.on('data', function(data) {
        body = body + data;
      }); 

      request.on('end', function() { // 더이상 들어 올 정보가 없으면 'end'의 콜백함수를 호출한다.
        var post        = qs.parse(body); // 정보를 객체화할 수 있다.
        var title       = post.title;
        var id          = post.id;
        var description = post.description;

        fs.rename(`data/${id}`, `data/${title}`, function(error) {
          // 파일 수정하기
          fs.writeFile(`data/${title}`, description, 'utf8', function(err) {
            response.writeHead(301, { // 301 : 이 웹주소는 해당 주소로 지금 바뀌었습니다!
              location: `/?id=${title}`
            }); 
            response.end('success');
          });
        });
      });
    } else if(pathname === '/delete_process') {
      var body = '';

      // createServer의 콜백함수 내 매개변수 이용 request, response
      request.on('data', function(data) {
        body = body + data;
      }); 

      request.on('end', function() {
        var post = qs.parse(body);
        var id   = post.id;

        var filteredId = path.parse(id).base;
        fs.unlink(`data/${filteredId}`, function(error) {
          // 삭제가 끝나면 home 경로로 보낸다.
          response.writeHead(302, { location: '/' }); 
          response.end();
        });
      });
    } else {
      response.writeHead(404);
      response.end('Not found');
    }
});
app.listen(3000);
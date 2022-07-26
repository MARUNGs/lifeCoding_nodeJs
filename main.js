var http = require('http');
var fs = require('fs');
var url = require('url'); // url를 요구하다

var app = http.createServer(function(request,response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var pathname = url.parse(_url, true).pathname;

    if(pathname === '/') {
      if(queryData.id === undefined) {
          fs.readdir('./data', function(error, fileList) {
            var title = 'Welcome';
            var description = 'Hello, Node.js';

            // li 반복문
            var list = '<ul>';
            var i = 0;
            while(i < fileList.length) {
              list = list + `<li><a href="/?id=${fileList[i]}">${fileList[i]}</a></li>`;
              i += 1;
            }
            list += '</ul>';

            var templete = `
            <!doctype html>
            <html>
            <head>
              <title>WEB1 - ${title}</title>
              <meta charset="utf-8">
            </head>
            <body>
              <h1><a href="/">WEB</a></h1>
              ${list}
              <h2>${title}</h2>
              <p>${description}</p>
            </body>
            </html>    
            `;

            response.writeHead(200);
            response.end(templete);
          });
      } else {
        fs.readdir('./data', function(error, fileList) {
          var title = 'Welcome';
          var description = 'Hello, Node.js';

          // li 반복문
          var list = '<ul>';
          var i = 0;
          while(i < fileList.length) {
            list = list + `<li><a href="/?id=${fileList[i]}">${fileList[i]}</a></li>`;
            i += 1;
          }
          list += '</ul>';
          // 파일 읽어오기
          fs.readFile(`data/${queryData.id}`, 'utf8', function(err, description) {
            // ***** title, h2 동적으로 변경하기 *****
            var title = queryData.id;
            var templete = `
            <!doctype html>
            <html>
            <head>
              <title>WEB1 - ${title}</title>
              <meta charset="utf-8">
            </head>
            <body>
              <h1><a href="/">WEB</a></h1>
              ${list}
              <h2>${title}</h2>
              <p>${description}</p>
            </body>
            </html>    
            `;

            response.writeHead(200);
            response.end(templete);
          });
        });
      }
    } else {
      response.writeHead(404);
      response.end('Not found');
    }
});
app.listen(3000);
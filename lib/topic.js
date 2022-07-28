var url = require('url');
var qs = require('querystring');
var template = require('./template.js');
var db = require('./db');

// 1. 메인화면
exports.home = function(request, response) {
    db.query(`SELECT * FROM topic`, function (error, topics, fields) {
        var title = 'Welcome';
        var description = 'Hello, Node.js';
        var list = template.list(topics);
        var html = template.html(title, list,
            `<h2>${title}</h2>${description}`,
            `<a href="/create">create</a>`);
        response.writeHead(200);
        response.end(html);
    });
}

// 2. 상세화면
exports.detail = function(request, response) {
    var _url = request.url;
    var queryData = url.parse(_url, true).query;

    db.query(`SELECT * FROM topic`, function (error, topics, fields) {
        if (error) throw error;

        // [queryData.id]가 자동으로 '?'에 치환되어 삽입된다.
        db.query(`SELECT * FROM topic LEFT JOIN author ON topic.author_id = author.id WHERE topic.id=?`, [queryData.id], function (error2, topic) {
            if (error2) throw error2;

            var title = topic[0].title;
            var description = topic[0].description;
            var list = template.list(topics);
            var html = template.html(title, list,
                `<h2>${title}</h2>
                ${description} 
                <p>
                    by ${topic[0].name}
                </p>`,
                `<a href="/create">create</a>
                <a href="/update?id=${queryData.id}">update</a>
                <form action="/delete_process" method="post">
                    <input type="hidden" name="id" value="${queryData.id}" />
                    <input type="submit" value="delete" />
                </form>`
            );

            response.writeHead(200);
            response.end(html);
        });
    });
}

// 3-1. 등록화면
exports.create = function(request, response) {
    db.query(`SELECT * FROM topic`, function (error, topics, fields) {
        if(error) throw error;

        var title = 'CREATE';
        var list = template.list(topics);
        var html = template.html(title, list,
            `<form action="/create_process" method="post">
                              <p>
                                <input type="text" name="title" placeholder="title" />
                              </p>
                              <p>
                                <textarea name="description" placeholder="description"></textarea>
                              </p>
                              <p>
                                <input type="submit" />
                              </p>
                            </form>`,
            `<a href="/create">create</a>`
        );

        response.writeHead(200);
        response.end(html);
    });
}

// 3-2. 등록
exports.create_process = function(request, response) {
    var body = '';
    request.on('data', function (data) {
        body = body + data;
    });
    request.on('end', function () { // 더이상 들어 올 정보가 없으면 'end'의 콜백함수를 호출한다.
        var post = qs.parse(body); // 정보를 객체화할 수 있다.

        db.query( // DB에 파일명, 내용 저장하기
            `INSERT INTO topic(title, description, created, author_id) VALUES(?, ?, now(), ?)`,
            [post.title, post.description, 1],
            function (error, result) {
                if (error) {
                    throw error;
                }

                response.writeHead(302, { location: `/?id=${result.insertId}` });
                response.end();
            }
        )
    });
}

// 4-1. 수정화면
exports.update = function(request, response) {
    var _url = request.url;
    var queryData = url.parse(_url, true).query;

    db.query(`SELECT * FROM topic`, function (error, topics) {
        if (error) throw error;
        
        db.query(`SELECT * FROM topic WHERE id=?`, [queryData.id], function (error2, topic, fields) {
            if(error2) throw error2;

            db.query(`SELECT * FROM author`, function (error3, authors) {
                var list = template.list(topics);
                var html = template.html(topic[0].title, list,
                    `<form action="/update_process" method="post">
                        <input type="hidden" name="id" value="${topic[0].id}" />
                        <p>
                            <input type="text" name="title" placeholder="title" value="${topic[0].title}" />
                        </p>
                        <p>
                            <textarea name="description" placeholder="description">${topic[0].description}</textarea>
                        </p>
                        <p>
                            ${template.authorSelect(authors, topic[0].author_id)}
                        </p>
                        <p>
                            <input type="submit" />
                        </p>
                    </form>`,
                    `<a href="/create">create</a> <a href="/update?id=${topic[0].id}">update</a>`
                );

                response.writeHead(200);
                response.end(html);
            });

        });
    });
}

// 4-2. 수정
exports.update_process = function(request, response) {
    var body = '';
    request.on('data', function (data) {
        body = body + data;
    });

    request.on('end', function () {
        var post = qs.parse(body);

        // DB 수정하기
        db.query(
            `UPDATE topic SET title=?, description=?, author_id=? WHERE id=?`
            , [post.title, post.description, post.author, post.id]
            , function(error, result) {
                if(error) {
                    throw error;
                }

                response.writeHead(302, {location: `/?id=${post.id}`});
                response.end();
            }
        )
    });
}

// 5. 삭제
exports.delete_process = function(request, response) {
    var body = '';
    request.on('data', function (data) {
        body = body + data;
    });

    // DB 삭제하기
    request.on('end', function () {
        var post = qs.parse(body);
        db.query(
            `DELETE FROM topic WHERE id=?`
            , [post.id]
            , function(error, result) {
                if(error) {
                    throw error;
                }

                response.writeHead(302, {location: `/`});
                response.end();
            }
        )
    });
}

// [6] Not Found
exports.notFound = function(request, response) {
    response.writeHead(404);
    response.end('Not found');
}
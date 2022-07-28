var db = require("./db");
var url = require('url');
var qs = require('querystring');
var template = require('./template.js');

// 1. 저자 목록
exports.home = function(request, response) {
    db.query(`SELECT * FROM topic`, function(error, topics) {
        db.query(`SELECT * FROM author`, function(error2, authors) {
            var title = 'author';
            var list = template.list(topics);
            var html = template.html(title, list,
                `${template.authorTable(authors)}
                <form action="/author/create_process" method="post" style="padding: 1.5rem;">
                    <div class="mb-3">
                        <label for="nameInput" class="form-label">name</label>
                        <input type="text" class="form-control" name="name" id="nameInput" placeholder="name" />
                    </div>
                    <div class="mb-3">
                        <label for="deTextarea" class="form-label">description</label>
                        <textarea name="profile" class="form-control" id="deTextarea" placeholder="description"></textarea>
                    </div>

                    <input type="submit" />
                 </form>`,
                 ``
            );
            response.writeHead(200);
            response.end(html);
        });
    });
}

// 2. 저자 등록
exports.create_author_process = function(request, response) {
    var body = '';
    request.on('data', function (data) {
        body = body + data;
    });
    request.on('end', function () {
        var post = qs.parse(body);

        db.query(
            `INSERT INTO author(name, profile) VALUES(?, ?)`,
            [post.name, post.profile],
            function (error, result) {
                if (error) throw error;

                response.writeHead(302, { location: `/author` });
                response.end();
            }
        )
    });
}

// 3-1. 저자 수정화면
exports.update = function(request, response) {
    db.query(`SELECT * FROM topic`, function(error, topics) {
        db.query(`SELECT * FROM author`, function(error2, authors) {
            var _url = request.url;
            var queryData = url.parse(_url, true).query;

            db.query(`SELECT * FROM author WHERE id=?`, [queryData.id], function(error3, author) {
                var title = 'author';
                var list = template.list(topics);
                var html = template.html(title, list,
                    `${template.authorTable(authors)}
                    <form action="/author/update_process" method="post" style="padding: 1.5rem;">
                        <div class="mb-3">
                            <label for="nameInput" class="form-label">name</label>
                            <input type="text" class="form-control" name="name" id="nameInput" value="${author[0].name}" placeholder="name"/>
                            <input type="hidden" name="id" value="${queryData.id}" />
                        </div>
                        <div class="mb-3">
                            <label for="deTextarea" class="form-label">description</label>
                            <textarea name="profile" class="form-control" id="deTextarea" placeholder="description">${author[0].profile}</textarea>
                        </div>
    
                        <input type="submit" value="update"/>
                     </form>`,
                     ``
                );

                response.writeHead(200);
                response.end(html);
            });
        });
    });
}

// 3-2. 저자 수정
exports.update_process = function(request, response) {
    var body = '';
    request.on('data', function (data) {
        body = body + data;
    });
    request.on('end', function () {
        var post = qs.parse(body);

        db.query(
            `UPDATE author SET name=?, profile=? WHERE id=?`,
            [post.name, post.profile, post.id],
            function (error, result) {
                if (error) throw error;

                response.writeHead(302, { location: `/author` });
                response.end();
            }
        )
    });
}

// 4. 저자 삭제
exports.delete_process = function(request, response) {
    var body = '';
    request.on('data', function (data) {
        body = body + data;
    });
    request.on('end', function () {
        var post = qs.parse(body);

        console.log(post.id);

        db.query(`DELETE FROM topic WHERE author_id=?`, [post.id], function(error1, result) {
            if(error1) throw error1;

            db.query(
                `DELETE FROM author WHERE id=?`, [post.id], function (error2, result) {
                    if (error2) throw error2;
    
                    response.writeHead(302, { location: `/author` });
                    response.end();
            });
        });
    });
}
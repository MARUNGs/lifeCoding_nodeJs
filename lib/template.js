module.exports = {
    html: function (title, list, body, control) { // 공통 템플릿 프로퍼티 생성
        return `
        <!doctype html>
        <html>
            <head>
                <title>WEB2 - ${title}</title>
                <meta charset="utf-8">
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossorigin="anonymous">
            </head>
            <body>
                <nav class="navbar navbar-expand-lg navbar-light bg-light">
                    <div class="container-fluid">
                        <a class="navbar-brand" href="/">Node.js</a>
                        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                            <span class="navbar-toggler-icon"></span>
                        </button>
                        
                            ${list}
                            
                    </div>
                </nav>
                <p>
                    <a href="/author">author</a>
                </p>
                ${control}
                ${body}
            </body>
        </html>    
        `;
    }, list: function (topics) { // 공통 li 반복문 프로퍼티 생성, topics: DB정보
        var list = `<div class="collapse navbar-collapse" id="navbarNav">`;
        var i = 0;
        while(i < topics.length) {
            list += `<a class="nav-link" href="/?id=${topics[i].id}">${topics[i].title}</a>`;
            i++;
        }
        list += `</div>`;

        return list;
    }, authorSelect: function(authors, author_id) {
        var optionTag = '';
        var i = 0;
        while(i < authors.length) {
            var selected = '';
            if(authors[i].id === author_id) selected = ' selected'; // 옵션 설정

            optionTag += `<option value="${authors[i].id}"${selected}>${authors[i].name}</option>`;
            i++;
        }

        return `<select name="author">
                    ${optionTag}
                </select>`;
    }, authorTable: function(authors) { // 저자 테이블 생성 함수
        var tag = '<table class="table table-success table-striped">';
        var i   = 0;

        while(i < authors.length) {
            tag += `<tr>
                        <td>${authors[i].name}</td>
                        <td>${authors[i].profile}</td>
                        <td><a href="/author/update?id=${authors[i].id}">update</a></td>
                        <td>delete</td>
                    </tr>`;
            i++;
        }

        tag += '</table>';
        return tag;
    }
};
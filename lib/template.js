module.exports = {
    html: function (title, list, body, control) { // 공통 템플릿 프로퍼티 생성
        return `
        <!doctype html>
        <html>
        <head>
        <title>WEB2 - ${title}</title>
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
    }, list: function (topics) { // 공통 li 반복문 프로퍼티 생성, topics: DB정보
        var list = '<ul>';
        var i = 0;
        while(i < topics.length) {
            list = list + `<li><a href="/?id=${topics[i].id}">${topics[i].title}</a></li>`;
            i += 1;
        }
        list += '</ul>';

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
    }
};
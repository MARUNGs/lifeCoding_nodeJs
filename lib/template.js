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
    }, list: function (fileList) { // 공통 li 반복문 프로퍼티 생성
        var list = '<ul>';
        var i = 0;
        while(i < fileList.length) {
        list = list + `<li><a href="/?id=${fileList[i]}">${fileList[i]}</a></li>`;
        i += 1;
        }
        list += '</ul>';

        return list;
    }
};
var testFolder = './data'; // 실행하고 있는 위치 기준으로 디렉토리 경로를 작성한다.
var fs = require('fs');

// ./data 경로 밑에 있는 파일 목록을 배열로 출력한다.
fs.readdir(testFolder, function(error, fileList) {
    console.log(fileList);
});
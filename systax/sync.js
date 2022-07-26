var fs = require('fs');

// 동기 예제문 readFileSync
// 실행순서 중요!
// readFileSync는 리턴값을 반환한다.
/*
console.log('A');
var result = fs.readFileSync('systax/sample.txt', 'utf8');
console.log(result);
console.log('C');
*/


// 비동기 예제문 readFile
// readFile는 리턴값을 반환하지 않는다. 대신, 함수를 세번째 인자에 삽입해야 한다.
console.log('A');
fs.readFile('systax/sample.txt', 'utf8', function(err, result) {
    // err 에러, result 파일내용
    console.log(result);
});
console.log('C');

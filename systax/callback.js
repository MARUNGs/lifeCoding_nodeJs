/*
function a() {
    console.log('A');
}
*/


var a = function () { // 이름이 없는 익명함수를 변수 a에 삽입
    console.log('A');
}

function slowFunc(callback) {
    callback(); // --> 변수 a에 담긴 함수가 실행된다.
}

slowFunc(a);
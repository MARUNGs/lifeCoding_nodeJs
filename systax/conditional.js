var args = process.argv.slice(2);
console.log(args[0]);

console.log('A');
console.log('B');

if(args[0] === '1') {
    console.log('C1');
} else {
    console.log('C2');
}

console.log('D');
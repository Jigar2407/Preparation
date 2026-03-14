let dev = [ 1, "Deep", 23, true, null, 5000 ];

for(let i=0 ; i < dev.length; i++){
    console.log(dev[i]);
}

console.log();
for(let key in dev){
    console.log(key,":",dev[key]);
}

console.log();
for(let item of dev){
    console.log(item)
}

console.log();
dev.forEach( ( item, index, arrayItSelf) => {
    console.log(`item :  ${item}  is at index : ${index} and TOtal Array Langth is : ${arrayItSelf.length}`)
});
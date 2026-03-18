async function task(){
    console.log(1);
    await takesTime();
    console.log(3);
}
task();

function takesTime(){
    return new Promise((resolve,reject)=>{
        setTimeout( ()=>{console.log(2);
        resolve()},2000);
    })
}

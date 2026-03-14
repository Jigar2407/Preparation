let stringArray = [ "Hera Pheri", "Chup Chup ke", "Welcome", "De Dana Dan" ,"Bhagm BHag", "Khatta Meetha", "HouseFUll"];

let numberArray = [3,5,6,8,4,78,5];

let multiArray = [
    [1,3,5,67,8,9,4,6],
    ["dev","me","myself","go"],
    ["this","is","arrray"]
];

// Find Out Varibale Is Arriay Or Not 
console.log(typeof stringArray, typeof numberArray, typeof multiArray) // Wrong Way This Will return Always `object`
// There is built-in Function `Array.isArray(variable)` which will return boolean accoding to arrray
console.log(Array.isArray(stringArray), Array.isArray(numberArray), Array.isArray(multiArray))

console.log("Original String Array ",stringArray, "Number Array ",numberArray, "MultiDimentional Array" ,multiArray);

console.log("Original String Array ",stringArray, "Number Array ",numberArray, "MultiDimentional Array" ,multiArray);

// find length
let arrayLength = stringArray.length;
console.log(`Length of String Array ${arrayLength}`);

// array.keys() returns array of keys
let arrayKeys = stringArray.keys();
console.log(`keys Array : `);
for(let i of arrayKeys){ console.log(i)}

// convert array to string as comma sapared values
let stringConvert = stringArray.toString();
console.log(`StringArray Converted Into comma Sapareted String : `,stringConvert);

// get values of specified Index 
let findValue = stringArray.at(3);
console.log(`Value At 3 Index ${findValue}`);

// join array elemet with specified delimeter or symbol into string
let delimeterSpecified = stringArray.join("@");
console.log(`Join With Specified Derlemeter `,delimeterSpecified);

// insert element at last index using array.push(value)
stringArray.push("Deep");
console.log(`Add Elemet At lAst`,stringArray);

numberArray.push(24);
console.log(`In number Array Add element At Last`, numberArray);

// removes elemet from last index and returns it using array.pop()
let removedElement = stringArray.pop() ;
console.log(`removed last index and Removd One is : ${removedElement}`);

// array.shift() removes elemt from 0 index and returns  it and redefineds length
let deletedElement = stringArray.shift();
console.log(`return and delete first index : ${deletedElement}`);

// array.unshift(value) :adds elemets at the index 0 and extends the length
stringArray.unshift("Dev ");
console.log(`Add At index 0 : ${stringArray}`);

// concate only two or more  array using array1.concat(array2,array3,array4,...,arrayN)
let mergedArray =  stringArray.concat(numberArray,["dev","hridyam"]);
console.log(`Merged Array ${mergedArray}`);

// multidimentionalArray.flat() takes Multidimentioanal array and gives indexed array
let indexConverted = multiArray.flat();
console.log(`Multi dimentional Convberted into indexed Array`,indexConverted);

// array.slice(start [,end]) it creates new array according to parameters
let slicedArray = stringArray.slice(1,5);
console.log("returns only start and end indexe between values array",slicedArray);

// array.splice(start, howManyYouWantTodelete, replceItem1, Replceitem2 ,..., relaceItemN) : it strts removing  from Starts and to how many you want to delete and if you defind other parametr it start to sreplace with starts
numberArray.splice(2, 4, 22, 33, 44, 55);
console.log(`replace from specific index ${numberArray}`);

// array.indexOf(value) gives oindex of  that value in array 
let findIndex = stringArray.indexOf("Welcome");
console.log(`returns indexof value "welcome" : ${findIndex}`);

// array.inclues(value) it retruns boolean according to if value exist in array or not
let ifExists = stringArray.includes("Welcome");
console.log(`returns boolean if value "welcome" exists : ${ifExists}`)
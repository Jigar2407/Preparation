let dev = [
    { name: "Deep", age: 20, designation: "MERN Stack Developer", companey: "Netclues", startYear:2000, endYear:2010 },
    { name: "Ujjavl", age: 23, designation: "Dot Net Developer" , companey: "IBM", startYear:2002, endYear:2008 },
    { name: "Jigo", age: 18, designation: "MERN Stack Developer" , companey: "Excelsier", startYear:2012, endYear:2015}, 
    { name: "ketul", age: 27, designation: "Data Scirntist" , companey: "Accuenture", startYear:1999, endYear:2014},
    { name: "Neel", age: 22, designation: "Data Scirntist" , companey: "TCS", startYear:2010, endYear:2014},
];
// usiing Reduce
let minAge = dev.reduce( ( accumulator, item) => Math.min(accumulator,item.age) , Infinity);
let maxAge = dev.reduce( (accumulator, item) => Math.max(accumulator,item.age) , 0);
console.log(minAge,maxAge);
// using MAp
let ages = dev.map( (item) => item.age );
maxAge =  Math.max(...ages);
minAge =  Math.min(...ages);
console.log(minAge,ages,maxAge);


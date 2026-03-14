// array.find(function(item,index,array){}/function({object key}))
// find methods returns  only first elemnet in the array that satisfy the given condition if all element dosent match condition it returns "undefined"
let dev = [
  { name: "Deep", age: 20, designation: "MERN Stack Developer", companey: "Netclues", startYear:2000, endYear:2010 },
  { name: "Jigo", age: 18, designation: "MERN Stack Developer" , companey: "Excelsier", startYear:2012, endYear:2015}, 
  { name: "Ujjavl", age: 23, designation: "Dot Net Developer" , companey: "IBM", startYear:2002, endYear:2008 },
  { name: "Neel", age: 22, designation: "Data Scientist" , companey: "TCS", startYear:2004, endYear:2014},
  { name: "ketul", age: 27, designation: "Data Scientist" , companey: "Accuenture", startYear:1996, endYear:2014},
];

// find First Data Scintist whose age is more than 25 and designation is data scintist
let findFirstDataScinetist = dev.find( ({ age, designation }) => age > 25 && designation == "Data Scientist");
console.log(`Data Scientist Whse age is greater Than 25`,findFirstDataScinetist);


// find the employee Who started working in leap year
let employee = dev.find( (item) => item.startYear % 4==0)
console.log(`EMployee Who Started Working on Leap Year `,employee );

let findcompany = dev.find( ({companey}) => companey == "Netclues" );
console.log(`Data who Company name netclunes is `, findcompany);



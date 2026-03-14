// array.filter(function(item,index,array));
// It Creates New array which Satisfy its condition in boolean if true it include in array otherwise exclude it
// so returns only filterd elements

let dev = [
    { name: "Deep", age: 20, designation: "MERN Stack Developer", companey: "Netclues", startYear:2000, endYear:2010 },
    { name: "Jigo", age: 17, designation: "MERN Stack Developer" , companey: "Excelsier", startYear:2012, endYear:2015}, 
    { name: "Ujjavl", age: 23, designation: "Dot Net Developer" , companey: "IBM", startYear:2002, endYear:2008 },
    { name: "ketul", age: 27, designation: "Data Scientist" , companey: "Accuenture", startYear:1999, endYear:2014},
    { name: "Neel", age: 22, designation: "Data Scientist" , companey: "TCS", startYear:2010, endYear:2014},
];


//Who is eligible for voting
let eligibleVoter = dev.filter( (item) => item.age >=18 ? true : false);
console.log(`Eligible Voters`,eligibleVoter);

// Who's Desination is Data Scientist
let dataSciemtist = dev.filter( (item) => item.designation == "Data Scientist") 
console.log(`Data Scientists Info :`,dataSciemtist);

// employee Who works more than 7 years
// let seniorEmployee = dev.filter( item => ( item.endYear - item.startYear ) > 7 && item.designation == "Data Scientist" )
let seniorEmployee = dev.filter( ({ endYear, startYear, designation }) => ( endYear - startYear ) > 7 && designation == "Data Scientist" )
console.log(`Here Are Employee Who Works more Then 7 years`,seniorEmployee);

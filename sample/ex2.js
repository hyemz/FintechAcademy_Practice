var car = {
	name : "sonata",
	ph : "500ph",
	start : function () {
		console.log("engine is starting");
	},
	stop : function () {
		console.log("engine is stoped");
	}
}

console.log(car.name);
console.log(car.ph);
car.start();

var cars = []; //배열초기화
var car01 = {    
    name : "sonata",    ph : "500ph",    start : function () 
    {        console.log("engine is starting");    },    stop : function () 
    {        console.log("engine is stoped");    }}
    var car02 = {
            name : "BMW",    ph : "600ph",    start : function () 
        {        console.log("engine is starting");    },    stop : function () 
        {        console.log("engine is stoped");    }}
        cars[0] = car01;cars[1] = car02;
        console.log(cars[1].name);
        console.log(cars[1].ph);
        console.log("시작");
        for(i=0; i < cars.length; i++) {
            
            console.log(cars[i].name);
            if(cars[i].name == "BMW") {
                console.log("find!");
            }

        }

// exports.perimeter = (x,y) => (2*(x+y))
// exports.area = (x,y) => (x*y)

// Another way of export
// When export multiple function, module.exports is required cannot use short hand exports
// let perimeter = (x,y) => (2*(x+y))
// let area = (x,y) => (x*y)

// module.exports = {
//     perimeter,
//     area
// }


module.exports = (x,y, callback) => {
    if(x <=0 || y <=0){
        //setTimeout take in 2 parameter, (a function, delay time)
        //this callback is called after a 2sec delay
        setTimeout(() => 
            //this callback is the arugument passed into the 3rd parameter. 
            //Callback take in 2 parameter (error, return value) 
            callback(new Error(`Rectangle dimensions should be greater than zero: x= ${x} and y = ${y}`), null), 
            // 1000ms === 1sec
            2000)
    } else {
        setTimeout(() =>
            // no error, 1st arg is null 
            // 2nd parameter, pass in JS object, the values are a function
            callback(null, {
                perimeter: () => (2*(x+y)),
                area: () => (x*y)
            }), 
            2000)
    }
}



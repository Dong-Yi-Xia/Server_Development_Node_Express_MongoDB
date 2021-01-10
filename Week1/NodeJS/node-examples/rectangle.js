// exports.perimeter = (x,y) => (2*(x+y))
// exports.area = (x,y) => (x*y)


// Another way of export
// When export multiple function, module.exports is required cannot use short hand exports
let perimeter = (x,y) => (2*(x+y))
let area = (x,y) => (x*y)

module.exports = {
    perimeter,
    area
}

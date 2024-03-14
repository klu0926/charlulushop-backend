const array = [
  { id: 1, name: 'lulu' },
  { id: 19, name: 'peter' },
  { id: 4, name: 'whatever' }
]




const newArray = Array.from(array, (obj) => obj.id)
console.log(newArray)
const handlebarHelper = {
  isSame: (arg1, arg2, options) => {
    return arg1 === arg2 ? options.fn(this) : options.inverse(this)
  },
  isCurrentPage: (arg1, arg2, option) => {
    return arg1 === arg2 ? 'current' : ''
  },
  checkLength: (arg1, arg2, option) => {
    return arg1 > arg2
  },
  isSold: (arg1, options) => {
    return arg1 === 0 ? options.fn(this) : options.inverse(this)
  },
}
module.exports = handlebarHelper

$(document).ready(function () {
  function truncateString (str, num) {
    var shortString = ''
    if (str.length > num) {
      if (num > 3) {
        shortString = str.slice(0, num - 3)
      } else {
        shortString = str.slice(0, num)
      }
      shortString += '...'
    } else {
      shortString = str
    }
    return shortString
  }

  
})

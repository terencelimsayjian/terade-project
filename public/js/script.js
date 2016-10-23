$(document).ready(function () {
  // var $newUser = $('.new-user')
  var $newListing = $('.new-listing')

  $newListing.on('submit', function (e) {
    e.preventDefault()

    var formdata = $(this).serializeArray()

    $.ajax({
      type: 'POST',
      url: '/terade/listings',
      data: formdata
    }).done(function () {
      console.log('done!')
    })
  })
})

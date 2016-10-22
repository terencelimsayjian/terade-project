$(document).ready(function () {
  var $newUser = $('.new-user')
  var $todoList = $('.to-do-list')
  var $userLogin = $('.user-login')

  $newUser.on('submit', function (e) {
    // e.preventDefault()
    //
    // var formdata = $(this).serializeArray()
    //
    // $.post({
    //   url: '/users/signup',
    //   data: formdata
    // }).done(function (data) {
    //   // window.location.assign()
    //   alert(data)
    // })
  })

  $todoList.on('submit', function (e) {
    e.preventDefault()

    var formdata = $(this).serializeArray()

    $.ajax({
      type: 'POST',
      url: '/todo',
      data: formdata
    }).done(function () {
      $('ul').append('<li>' + formdata[0].value + ' ' + formdata[1].value + ' ' + formdata[2].value + '</li>')
    })
  })

  $userLogin.on('submit', function (e) {
  //   e.preventDefault()
  //
  //   var formdata = $(this).serializeArray()
  //   $.ajax({
  //     type: 'POST',
  //     url: '/users/login',
  //     data: formdata
  //   }).done(function () {
  //
  //   })
  })
})

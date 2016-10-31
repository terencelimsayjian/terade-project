var User = require('../models/user')

var userController = {
  getUsers: function (req, res) {
    User.find({}, function (err, allUsers) {
      if (err) throw err
      res.render('user/index', { data: allUsers })
    })
  }
}

module.exports = userController

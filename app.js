var express = require('express')
var bodyParser = require('body-parser')
var expressLayouts = require('express-ejs-layouts')
var path = require('path')
var mongoose = require('mongoose')
var dotenv = require('dotenv')
var session = require('express-session')
var flash = require('connect-flash')
var passport = require('passport')
var MongoStore = require('connect-mongo')(session)
var morgan = require('morgan')
var connect = require('connect')
var methodOverride = require('method-override')

var teradeRoutes = require('./routes/terade')
var listingRoutes = require('./routes/listing')
var userRoutes = require('./routes/user')

var app = express()

dotenv.load({ path: '.env.' + process.env.NODE_ENV })
mongoose.connect(process.env.MONGO_URI)

mongoose.Promise = global.Promise

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.use(session({
  secret: process.env.EXPRESS_SECRET,
  resave: true,
  saveUninitialized: true,
  store: new MongoStore({
    url: process.env.MONGO_URI,
    autoReconnect: true
  })
}))

// app.use(methodOverride('X-HTTP-Method-Override'))
app.use(methodOverride('_method'))

app.use(morgan('dev'))
app.use(passport.initialize())
app.use(passport.session())
require('./config/passport')(passport)

app.use(flash())

app.use(express.static(__dirname + '/public'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(expressLayouts)

app.use('/users', userRoutes)
app.use('/listings', listingRoutes)
app.use('/terade', teradeRoutes)

app.listen(process.env.PORT || 3000)
console.log('Server started')

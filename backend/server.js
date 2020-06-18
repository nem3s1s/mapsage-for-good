var path = require('path');
var express = require("express")
var cors = require("cors")
var bodyParser = require("body-parser")
var app = express()
var mongoose = require("mongoose")
var cookieParser = require("cookie-parser")
var port = process.env.PORT || 3000

process.env.SERVER_LOCATION = 'http://localhost:' + port + '/';
process.env.SECRET_KEY = 'EWl9Lcrav8'; // secret for JWT
app.use(cookieParser('ztVX2HQJP0')); // secret for cokieParser

app.use(bodyParser.json())
app.use(cors({
    origin: 'http://localhost:8080',
    credentials: true
  }))
app.use(bodyParser.urlencoded({ extended: false }))

const mongoURI = 'mongodb://localhost:27017/mapsage'

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.log(err))

// APIs registration
var usersRoutes = require("./routes/usersRoutes")
var customersRoutes = require("./routes/customersRoutes")
var masseursRoutes = require("./routes/masseursRoutes")
usersRoutes(app)
customersRoutes(app)
masseursRoutes(app)

app.use('/static', express.static(__dirname + '/public'));

app.use(function(req, res) {
    res.status(404).send({url: req.originalUrl + " not found"})
});

app.listen(port, function () {
    console.log("Server is running on port: " + port)
})

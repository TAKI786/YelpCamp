var express          = require('express'), 
    app              = express(),
    bodyParser       = require('body-parser'),
    mongoose         = require('mongoose'),
    passport         = require('passport'),
    LocalStrategy    = require("passport-local"),
    Campground       = require('./models/campground.js'),
    Comment          = require('./models/comment.js'),
    User             = require('./models/user'),
    flash            = require("connect-flash"),
    methodOverride   = require('method-override'),
    commentRoutes    = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    indexRoutes      = require("./routes/index"),
    cors             = require("cors");

require("dotenv").config();
app.use(cors());


// seedDB();
// mongo "mongodb+srv://cluster0-3pmxp.mongodb.net/test" --username yelpcamp
mongoose.connect(process.env.MONGODB_URI" || "mongodb://localhost/yelp_camp");
// mongoose.connect("mongodb+srv://yelpcamp:12345@cluster0-3pmxp.mongodb.net/test?retryWrites=true&w=majority");
// const MongoClient = require('mongodb').MongoClient;
// const assert = require('assert');

// const uri = "mongodb://Yelpcamp:yelpcamp123@cluster0-3pmxp.mongodb.net/test?ssl=true&w=majority";
// const uri = "mongodb+srv://yelpcamp:12345@cluster0-3pmxp.mongodb.net/test?retryWrites=true&w=majority";
// mongoose.connect(uri, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// });

// mongoose.connection.on('connected',() =>{
// 	console.log('mongoose is connected.');
// });

// app.use(express.json());
// app.use(express.urlencoded({ extended: false}));
// .then(() => {
//   console.log("MongoDB Connected…");
// })
// .catch(err => console.log(err))

// const MongoClient = require('mongodb').MongoClient;
// const uri = "mongodb+srv://yelpcamp:12345@cluster0-3pmxp.mongodb.net/test?retryWrites=true&w=majority";
// const client = new MongoClient(uri, { useNewUrlParser: true });
// client.connect(err => {
//   const collection = client.db("test").collection("devices");
//   // perform actions on the collection object
//   client.close();
// });
// var MongoClient = require('mongodb').MongoClient;

// var uri = "mongodb+srv://yelpcamp:12345@cluster0-3pmxp.mongodb.net/test?retryWrites=true&w=majority";
// MongoClient.connect(uri, function(err, db) {
//   db.close();
// });

app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine','ejs');
app.use(require("express-session")({
	secret: "I'm the best",
	resave: false,
	saveUninitialized: false
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride('_method'));
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
	res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
	next();
});

app.use(express.static(__dirname + "/public"));

app.use(indexRoutes);
app.use(commentRoutes);
app.use(campgroundRoutes);

app.listen(process.env.PORT || 3000, function(req,res){
	console.log(' ############### Server Has Started ###############');
});


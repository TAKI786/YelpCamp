var express          = require('express'),
    app              = express(),
    bodyParser       = require('body-parser'),
    mongoose         = require('mongoose'),
    passport         = require('passport'),
    LocalStrategy    = require("passport-local"),
    Campground       = require('./models/campground.js'),
    Comment          = require('./models/comment.js'),
    User             = require('./models/user'),
    // seedDB           = require("./seeds"),
    flash            = require("connect-flash"),
    methodOverride   = require('method-override'),
    commentRoutes    = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    indexRoutes      = require("./routes/index");

// seedDB();
// mongoose.connect("mongodb://localhost/yelp_camp");
const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://Yelpcamp:yelpcamp123@cluster0-3pmxp.mongodb.net/test?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlPaser: true});
client.connect(err => {
    const collectin = client.db("test").collection("devices");
    client.close();
});

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


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

// mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/yelp_camp");

const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://Taki:Taki@yelp.3pmxp.mongodb.net/Yelp?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true });
client.connect(err => {
  const collection = client.db("test").collection("devices");
  // perform actions on the collection object
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


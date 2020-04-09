var express = require("express");
var router = express.Router();
var Campground       = require('../models/campground.js'),
    Comment          = require('../models/comment.js'),
    User             = require('../models/user.js'),
    passport         = require('passport'),
    LocalStrategy    = require("passport-local");


router.get('/',function(req,res){  
	res.render('campgrounds/home',);
});

router.get("/register", function(req,res){
	res.render("auth/register",);
});

router.post("/register",function(req,res){
	User.register(new User({username: req.body.username}), req.body.password, function(err,user){
		if(err){
			req.flash("error", err.message);
			return res.redirect("/register");
		}else{
		    passport.authenticate("local")(req, res, function(){
		    	req.flash("success","Sign Up Successfully !!")
			res.redirect("/campgrounds");
		});
		}
	});
});


router.get("/login",function(req,res){
	res.render("auth/login");
});

router.post("/login", passport.authenticate("local", {
	successRedirect: "/campgrounds",
	failureRedirect: "/login"
}), function(req,res){});


router.get("/logout", function(req, res){
	req.logout();
	req.flash("success","Logged You Out !!");
	res.redirect("/campgrounds");
});


function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	req.flash("error","Please Login First !!");
	res.redirect("/login");
}

module.exports = router;
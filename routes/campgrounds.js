var express = require("express");
var router = express.Router();
var Campground       = require('../models/campground.js'),
      methodOverride = require('method-override')
    Comment          = require('../models/comment.js');

router.use(methodOverride('_method'));

router.get('/campgrounds',function(req,res){
	
	Campground.find({},function(err, allcampgrounds){
		if(err){
			console.log("Error");
		} else {
			res.render('campgrounds/campgrounds',{campgrounds: allcampgrounds});
		}
	});

}); 

router.get('/campgrounds/new', isLoggedIn, function(req,res){
	res.render("campgrounds/new",{currentUser: req.user});
});


router.post('/campgrounds',function(req,res){
	var name          = req.body.name;
	var image         = req.body.image;
	var description   = req.body.description;
	var cost          = req.body.cost;
	var username      = req.user.username;
	var newCampground = {name: name, image: image, description: description, cost: cost, username: username}
	Campground.create(newCampground, function(err, newlyCreated){
		if(err){
			console.log(err);
		}
		else{
	    	res.redirect("/campgrounds");
		}
	});
});

router.get('/campgrounds/:id', function(req,res){
		Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
			if(err){
				console.log(err);
			}
			else
			{
				// console.log("campgrounds comments inside campground/id"+foundCampground.comments);
				res.render("campgrounds/show",{campground: foundCampground});
			}
		});	
});

router.get('/campgrounds/:id/edit', checkOwner, function(req,res){
  	Campground.findById(req.params.id, function(err, foundCampground){
                res.render('campgrounds/edit',{campground: foundCampground});
	});
});

router.put('/campgrounds/:id', checkOwner, function(req,res){
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
	  	res.redirect('/campgrounds/'+req.params.id);
	});
});

router.delete("/campgrounds/:id", checkOwner, function(req,res){
	Campground.findByIdAndRemove(req.params.id, function(err){
		res.redirect('/campgrounds');
	});
});

function isLoggedIn(req, res, next){ 
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "Please \"SignUp\" First !!  \n  If already have account then \"Login \" "); 
    res.redirect("/register");
}

function checkOwner(req, res, next){
	  if(req.isAuthenticated()){
  			Campground.findById(req.params.id, function(err, foundCampground){
				if(err){
					res.redirect('/campgrounds');
				}
				else{
					if(foundCampground.username === req.user.username )
					{
		                next();
					} else {
						req.flash("error", "You dont't have permission to do")
					    res.redirect('/campgrounds/'+req.params.id);			
					}
				}
		});
  } else {
  		res.redirect('/login');
  }
}

module.exports = router;
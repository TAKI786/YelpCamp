var express          = require("express");
var router           = express.Router();
var Campground       = require('../models/campground.js'),
    Comment          = require('../models/comment.js');

router.get("/campgrounds/:id/comments/new",isLoggedIn, function(req, res){
	Campground.findById(req.params.id, function(err, campground){
		if(err){
			console.log(err);
		}
		else{
			res.render("comments/new", {campground: campground});
		}
     });
});


router.post("/campgrounds/:id/comments",isLoggedIn, function(req,res){

		var text = req.body.text;
		var newComment = {text: text,author: req.user.username};


    Campground.findById(req.params.id, function(err, campground){
    	if(err){
    		console.log(err);
    		res.redirect("/campgrounds");
    	}
    	else{
    		Comment.create(newComment, function(err, comment){
    			if(err){
    				console.log(err);
    			}else{
    				campground.comments.push(comment);
    				campground.save();
    				console.log(comment.author);
    				res.redirect("/campgrounds/"+campground._id)
    			}
    		})
    }
  });
});

router.get("/campgrounds/:id/comments/:comment_id/edit", isLoggedIn, function(req,res){
    Campground.findById(req.params.id, function(err, foundCampground){
        if(err){
            res.redirect('/campgrounds');
        }
        else{
           Comment.findById(req.params.comment_id, function(err, comment){
                if(err){
                    res.redirect('/campgrounds'+campground._id);
                }
                else{
                    res.render('comments/edit',{campground: foundCampground, comment: comment});
                }
            });
        }
    });
});

router.put("/campgrounds/:id/comments/:comment_id", isLoggedIn,function(req,res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
              if(err){
                res.redirect('/campgrounds');
              }
              else{
                res.redirect('/campgrounds/'+req.params.id);
              }
     });
});

router.delete("/campgrounds/:id/comments/:comment_id", function(req,res){
    Campground.findById(req.params.id, function(err, foundCampground){
        if(err){
            res.redirect('/campgrounds');
        }
        else{
            Comment.findByIdAndRemove(req.params.comment_id, function(err){
                if(err){
                    res.redirect('/campgrounds');
                }
                else{
                    res.redirect('/campgrounds/'+req.params.id);
                }
            });
        }
    });
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error","Please Login First!!");
    res.redirect("/login");
}

module.exports = router;
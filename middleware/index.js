// all the middleware goes here
var Campground = require("../models/campground"),
    Comment = require("../models/comment"),
    middlewareObj = {};

middlewareObj.checkCampgroundOwnership = function(req, res, next){
    if(req.isAuthenticated()){        
        Campground.findById(req.params.id, function(err, campground){
            // !null is true, so if campground is null, go to errmessage
            if (err || !campground) {
                req.flash("error", "Campground not found");
                res.redirect("back");
            } else {
                // does user own the campground?
                // campground.author.id is an mongoose Object
                // So cann't use req.user._id === campground.author.id
                if (campground.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("error", "You don't have permission to do that");
                    res.redirect("back");                    
                }                            
            }
        });
    } else {
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back");      
    }
};

middlewareObj.checkCommentOwnership = function(req, res, next){
    if(req.isAuthenticated()){        
        Comment.findById(req.params.comment_id, function(err, comment){
            if (err || !comment) {
                req.flash("error", "Comment not found");
                res.redirect("back");
            } else {
                // does user own the comment?
                if (comment.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("error", "You don't have permission to do that");
                    res.redirect("back");                    
                }                            
            }
        });
    } else {
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back");      
    }
};

middlewareObj.isLoggedIn = function(req, res, next) {
    if(req.isAuthenticated()){
        return next();
    }
    // Give us the ability to use flash, not flashing right away
    req.flash("error", "You need to be logged in to do that");
    res.redirect("/login");
};

module.exports = middlewareObj;
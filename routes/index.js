var express = require("express"),
    router = express.Router(),
    passport = require("passport"),
    User = require("../models/user");


//root route
router.get("/", function(req, res){
    res.render("landing")
});

// Auth routes
// register
router.get("/register", function(req, res){
    res.render("register", {page: "register"});
});

router.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            // User err in flash, can console.log(err) to say what in err
            req.flash("error", err.message);
            return res.redirect("/register");
        }
        passport.authenticate("local")(req, res, function(){
            req.flash("success", "Welcome to YelpCamp" + user.username);
            res.redirect("/campgrounds");
        });
    });
});

// Login
router.get("/login", function(req, res){
    res.render("login", {page: "login"});
});

// app.post("/login", middleware, callback);
router.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    }), function(req, res){
});

// Logout
router.get("/logout", function(req, res){
    req.logout();
    req.flash("success", "Logged you out");
    res.redirect("/campgrounds");
})

module.exports = router;
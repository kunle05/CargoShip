const mongoose = require('mongoose');
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');

const Location = mongoose.model('Location');
const User = mongoose.model('User');

module.exports = {
    userLogin: async (req, res) => {
        var secret = process.env.SECRET_KEY_ONE
        const { password, username } = req.body;
        const loggedUser = await User.findOne({username: username})
 
        if(loggedUser === null) {
            return res.json({status: 400, err: "Incorrect username or password"})
        }

        const correctPw = await bcrypt.compare(password, loggedUser.password)
        if(!correctPw) return res.json({status: 400, err: "Incorrect username or password"})

        if(loggedUser.status === 0) return res.json({status: 400, err: "Account disabled. Contact Admin"})
        if(loggedUser.level === 3) secret = process.env.SECRET_KEY_ASST
        if(loggedUser.level === 5) secret = process.env.SECRET_KEY_ADMIN

        const userToken = jwt.sign({
            id: loggedUser._id,
            level: loggedUser.level
        }, secret);
        res.cookie("_usl_sign", userToken, secret, {httpOnly: true})
        .json(loggedUser)
    },

    changeUserPass: async (req, res) => {
        const { id, oldPassword, newPassword, confirmPassword } = req.body;
        const user = await User.findById(id)
        if(user === null) return res.json({status: 400, err: "Something went wrong"})

        const correctPw = await bcrypt.compare(oldPassword, user.password)
        if(!correctPw) return res.json({status: 400, err: "Incorrect password"})

        user.password = newPassword;
        user.confirmPassword = confirmPassword;
        user.save()
        .then(updatedUser => {
            res.json(updatedUser)
        })
    },

    //Only level 5 users should be able to access
    newUser: async (req, res) => {
        console.log("Creating new user");
        const { username, location } = req.body;

        const existingUser = await User.findOne({username: username})
        if(existingUser) return res.json({status: 400, message: "Username is taken"});
        
        const storeLoc = await Location.findById(location)
        if(!storeLoc) return res.json({status: 400, message: "Choose a valid location"});

        const user = new User(req.body);
        user.location = storeLoc;
        user.save()
            .then(newUser => {
                // const userToken = jwt.sign({
                //     id: newUser._id,
                //     level: loggedUser.level
                // }, process.env.SECRET_KEY);

                // res.cookie("usertoken", userToken, {httpOnly: true})
                res.json({user: newUser});
            })
            .catch(err => res.json(err));
    },
    users: (req, res) => {
        //Only level 3 and 5 users should be able to access
        User.find().sort('username')
            .then(users => res.json(users))
            .catch(err => res.json(err));
    },
    user: (req, res) => {
        User.findById(req.params.id)
            .then(thisUser => res.json(thisUser))
            .catch(err => res.json(err));
    },
    editUser: (req, res) => {
        //Only level 5 users should be able to access
        if(!req.body.password) {
            console.log("trying to update no password");
            Location.findById(req.body.location)
            .then(thisLoc => {
                req.body.location = thisLoc;
                delete req.body.password;
                User.findByIdAndUpdate(req.params.id, req.body, {new: true})
                .then(updated => res.json(updated))
                .catch(err => res.json(err));
            })
        }
        else {
            console.log("***** \n Running first statement \n*****")
            Location.findById(req.body.location)
            .then(thisLoc => {
                User.findById(req.params.id)
                .then(thisUser => {
                    req.body.location = thisLoc;
                    for(field in req.body){
                        thisUser[field] = req.body[field];
                    }
                    thisUser.confirmPassword = req.body.password;
                    thisUser.save()
                        .then(updatedUser => res.json(updatedUser))
                        .catch(err => res.json(err));
                })
                .catch(err => res.json(err));
            })
            .catch(err => res.json(err));
        }
    },
    disableUser: (req, res) => {
    //Level 3 upward
        User.findByIdAndUpdate(req.params.id, {status: req.params.stat})
            .then(disabledUser => res.json(disabledUser))
            .catch(err => res.json(err));
    },
    removeUser: (req, res) => {
    //Only level 5 users should be able to access
        User.findByIdAndRemove(req.params.id)
        .then(removedUser => {
            res.json(removedUser);
        })
        .catch(err => res.json(err));
    },
    logout: (req, res) => {
        res.clearCookie('_usl_sign');
        res.sendStatus(200);
    }
}


const mongoose = require('mongoose');
const Location = mongoose.model('Location');

module.exports = {
    //level 5 only
    newLocation: (req, res) => {
        console.log("***** \n creating new Location \n*****");
        console.log(req.body);
        const loc = new Location(req.body);
        loc.save()
        .then(newLoc => {
            console.log('My new location is ' + newLoc);
            res.json(newLoc);
        })
        .catch(err => res.json(err));
    },
    locations: (req, res) => {
        console.log("Getting all locations");
        Location.find().sort('-status')
            .then(locations => {
                res.json(locations);
            })
            .catch(err => res.json(err));
    },
    location: (req, res) => {
        console.log("***** \n Getting one location \n*****")
        Location.findById(req.params.id)
            .then(thisLoc => {
                console.log(thisLoc);
                res.json(thisLoc);
            })
            .catch(err => res.json(err));
    },
    editLocation: (req, res) => {
        console.log("***** \n Editing Location \n*****");
        //level 5 only
        Location.findById(req.params.id)
            .then(foundLoc => {
                for(field in req.body){
                    foundLoc[field] = req.body[field];             
                }
                foundLoc.save()
                    .then(updatedLoc => res.json(updatedLoc))
                    .catch(err => res.json(err));
            })
            .catch(err => res.json(err));
    },
    disableLoc: (req, res) => {
        //Level 5 only
            Location.findByIdAndUpdate(req.params.id, {status: req.params.stat})
                .then(disabledLoc => {console.log(disabledLoc); res.json(disabledLoc)})
                .catch(err => res.json(err));
    },
    removeLocation: (req, res) => {
        console.log("***** \n Removing Location \n*****");
        //returns removed version then you can add back but to d bottom of list
        //lvel 5 only
        Location.findByIdAndRemove(req.params.id)
            .then(RemovedLoc => {
                console.log(RemovedLoc);
                res.json(RemovedLoc);
            })
            .catch(err => res.json(err));
    }
}
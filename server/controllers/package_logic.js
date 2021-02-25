const mongoose = require('mongoose');
const User = mongoose.model('User');
const Package = mongoose.model('Package');
const Location = mongoose.model('Location');
const Tracker = mongoose.model('Tracker');
const Item = mongoose.model('Item');

module.exports = {
    //result shoud vary by user level
    index: (req, res) => {
        console.log("index route");
        Package.find().sort('-createdAt')
            .then(packages => {
                console.log(packages);
                res.json(packages);
            })
            .catch(err => res.json(err));
    },

    newPackage: (req, res) => {
        console.log("Creating new package");
        let all_Items = req.body.item_count;
        let userId = req.body._id;
        delete req.body.item_count;

        Location.find()
            .then(locations => {
                locations.forEach(loc => {
                    if(loc._id == req.body.origin_loc) req.body.origin_loc = loc;
                    if(loc._id == req.body.destination) req.body.destination = loc;
                });
                req.body.status = "Received";

                const package = new Package(req.body);
                package.save()
                    .then( newPackage => {
                        User.findById(userId)
                        .then(myUser => {
                            const tracker = new Tracker({action: "Received", user: myUser})
                            tracker.save()
                            .then(itemTrack => {
                                all_Items.forEach((one_item, ind) => {
                                    let item = new Item(one_item) 
                                    item.status = itemTrack
                                    item.save()
                                    .then( itemX => {
                                        newPackage.item_count.push(itemX)
                                        console.log(ind);
                                        if(ind == all_Items.length-1){
                                            newPackage.save()
                                            .then(data => res.json(data));  
                                        }
                                    })
                                    .catch(err => res.json(err));
                                })
                            })
                            .catch(err => res.json(err));
                        })
                        .catch(err => res.json(err));               
                    })
                    .catch(err => res.json(err));
            })
            .catch(err => res.json(err));
    },

    getPackage: (req, res) => {
        console.log("Getting a package");
        Package.findById(req.body)
        .then(package => res.json(package))
        .catch(err => res.json(err));
    },
    updateItems: (req, res) => {
        console.log("Updating items");
        Package.findById(req.body.pack_id)
        .then(thisPackage => {
            thisPackage.item_count.forEach(item => {
                req.body.updates.forEach(reqItem => {
                    if(item.id == reqItem.id) item.status.action = reqItem.status;
                })
            })
            let x = thisPackage.item_count[0].status.action
            let y = true;
            thisPackage.item_count.forEach(item => {
                if(item.status.action != x) y = false;
            })
            if (y == true) thisPackage.status = x;
            else thisPackage.status = "Other";
            if(y == true && x == "Picked Up") thisPackage.del_date = Date.now();
            thisPackage.save()
            .then(updatedPackage => res.json(updatedPackage))
            .catch(err => res.json(err));
        })
        .catch(err => res.json(err));
    },
    destroyPackage: (req, res) => {
        //Only level 3 upward
        Package.findByIdAndRemove(req.params.id)
        .then(removedPackage => {
            res.json(removedPackage);
        })
        .catch(err => res.json(err));
    },
    deleteItem: (req, res) => {
        //Only level 3 upward
        Item.findByIdAndRemove(req.params.id)
        .then(removedItem => {
            res.json(removedItem);
        })
        .catch(err => res.json(err));
    },
    updatePackInfo: (req, res) => {
        Package.findById(req.params.id)
        .then(thisPack => {
            if(thisPack.destination.id != req.body.destination) {
                Location.findById(req.body.destination)
                .then(newLoc => {
                    req.boy.destination = newLoc;
                    for(item in req.body){
                        thisPack[item] = req.body[item]
                    }
                    thisPack.save()
                    .then(newPack => res.json(newPack))
                    .catch(err => res.json(err));
                })
            }
            else {
                delete req.body.destination;
                for(item in req.body){
                    thisPack[item] = req.body[item]
                }
                thisPack.save()
                .then(newPack => res.json(newPack))
                .catch(err => res.json(err));
            }
        })
    }
}
const Packages = require('../controllers/package_logic');
const Locations = require('../controllers/loc_logic');
const Users = require('../controllers/user_logic');
const auth = require('./jwt.config');

module.exports = (app) => {
    app.get('/', (req, res) => res.render("addLoc"));

    //Location routes
    app.post('/newLocation', auth.admin, Locations.newLocation);
    app.get('/locs/:level', auth.base, Locations.locations);  //checked
    app.get('/loc/:id', Locations.location);
    app.put('/loc/:id', auth.admin, Locations.editLocation); //checked
    app.get('/loc/disable/:id/:stat', auth.admin, Locations.disableLoc); //checked
    app.delete('/del_loc/:id', Locations.removeLocation);

    //User routes
    app.post('/auth/login', Users.userLogin);   //checked 
    app.post('/user', auth.admin, Users.newUser);   //checked  
    app.post('/user/update/:level', auth.base, Users.changeUserPass);  //checked
    app.get('/all_users/:level', auth.asst, Users.users);  //checked
    app.get('/user/:id/:level', auth.base, Users.user);  //checked
    app.put('/user/:id', auth.admin, Users.editUser);  //checked
    app.get('/user/disable/:id/:stat', auth.admin, Users.disableUser);  //checked
    app.delete('/del_user/:id', auth.admin, Users.removeUser);
    app.get('/logout', Users.logout); //checked

    //Package routes
    app.get('/home', Packages.index);
    app.post('/newPackage', Packages.newPackage);  
    app.post('/package', Packages.getPackage);
    app.post('/package/update', Packages.updateItems);  
    app.delete('/package/del/:id', Packages.destroyPackage);
    app.delete('/item/:id', Packages.deleteItem);
    app.put('/package/info/:id', Packages.updatePackInfo);
    
}
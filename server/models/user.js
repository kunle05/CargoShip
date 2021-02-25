const mongoose = require('mongoose');
const validate = require('mongoose-validator');
const bcrypt = require('bcrypt');
const LocationSchema = require('./location.js').schema;

// const pw_Validator = [
//     validate({
//         validator: 'isAlphanumeric',
//         passIfEmpty: true,
//         message: 'Password should contain atleast 1 number'
//     })
// ]

const UserSchema = new mongoose.Schema({
    fname: {type: String, required: [true, 'First name required'], minlength: 2},
    lname: {type: String, required: [true, 'Last name required'], minlength: 2},
    username: {type: String, required: [true, 'Username required'], minlength: 2},
    password: {type: String, required: true},
    location: {type: LocationSchema},
    status: {type: Number, default: 1},
    level: {type: Number, enum: [1,3,5], required: true, default: 1},
}, {timestamps: true})

UserSchema.virtual('confirmPassword')
  .get( () => this._confirmPassword )
  .set( value => this._confirmPassword = value );

UserSchema.pre('validate', function(next) {
    if (this.password !== this.confirmPassword) {
        this.invalidate('confirmPassword', 'Password must match confirm password');
    }
    next();
});

UserSchema.pre('save', function(next) {
    bcrypt.hash(this.password, 10)
    .then(hash => {
        this.password = hash;
        next();
    })
})

const User = mongoose.model('User', UserSchema);

module.exports = User;
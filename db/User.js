import mongoose from "mongoose"
import uniqueValidator from "mongoose-unique-validator"
import bcrypt from "bcryptjs"
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  firstName: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 30,
    trim: true,
    match: /^([A-Za-z0-9_](?:(?:[A-Za-z0-9_]|(?:\.(?!\.))){0,28}(?:[A-Za-z0-9_]))?)$/,
  },
  lastName: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 30,
    trim: true,
    match: /^([A-Za-z0-9_](?:(?:[A-Za-z0-9_]|(?:\.(?!\.))){0,28}(?:[A-Za-z0-9_]))?)$/,
  },
  username: {
    type: String,
    minlength: 3,
    // maxlength: 30,
    trim: true,
    // match: /^([A-Za-z0-9_](?:(?:[A-Za-z0-9_]|(?:\.(?!\.))){0,28}(?:[A-Za-z0-9_]))?)$/,
    required: true,
    unique: false,
  },
  email: {
    type: String,
    trim: true,
    required: true,
    maxlength: 40,
    unique: true,
    match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
  },
  password: {
    trim: true,
    minlength: 3,
    type: String,
    required: true,
  },
});

UserSchema.plugin(uniqueValidator);

UserSchema.methods.validPassword = function(password) {
  return 
};

// UserSchema.virtual("password").set(function(value) {
//   this.passwordHash = bcrypt.hashSync(value, bcrypt.genSaltSync(12));
// });

const User = mongoose.model("User", UserSchema);

export default User;

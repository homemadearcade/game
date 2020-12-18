import mongoose from "mongoose"
import uniqueValidator from "mongoose-unique-validator"
import bcrypt from "bcryptjs"
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

UserSchema.plugin(uniqueValidator);

UserSchema.methods.validPassword = function(password) {
  return bcrypt.compare(password, this.password);
};

// UserSchema.virtual("password").set(function(value) {
//   this.passwordHash = bcrypt.hashSync(value, bcrypt.genSaltSync(12));
// });

const User = mongoose.model("User", UserSchema);

export default User;

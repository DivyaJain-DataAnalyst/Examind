import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    minLength: [6, 'Email must be at least 6 characters long'],
    maxLength: [50, 'Email must not be longer than 50 characters']
  },
  password: {
    type: String,
    required: true,
    select: false
  },
  role: {
    type: String,
    enum: ['student', 'teacher'],
    default: 'student'
  }
});


userSchema.statics.hashPassword = async function (password) {
    return await bcrypt.hash(password, 10);
}

userSchema.methods.isValidPassword = async function (password) {
    return await bcrypt.compare(password, this.password);
}

userSchema.methods.generateJWT = function () {
  return jwt.sign(
    {
      _id: this._id,              // ✅ required for createTestController
      name: this.name,
      email: this.email,
      role: this.role
    },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );
};




const User = mongoose.model('User', userSchema);

export default User;
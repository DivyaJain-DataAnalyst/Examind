import userModel from '../models/user.model.js';




export const createUser = async ({ name, email, password, role }) => {
  if (!name || !email || !password || !role) {
    throw new Error('All fields are required');
  }

  const hashedPassword = await userModel.hashPassword(password);

  const user = await userModel.create({
    name,
    email,
    password: hashedPassword,
    role
  });

  return user;
};

export const getAllUsers = async ({ userId }) => {
    const users = await userModel.find({
        _id: { $ne: userId }
    });
    return users;
}
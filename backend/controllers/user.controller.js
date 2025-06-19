import userModel from '../models/user.model.js';
import * as userService from '../services/user.service.js';
import { validationResult } from 'express-validator';
import redisClient from '../services/redis.service.js';

export const createUserController = async (req, res) => {
    console.log("Received user creation request:", req.body);

  try {
    const { name, email, password, role } = req.body;

    const user = await userService.createUser({ name, email, password, role });

    const token = user.generateJWT();

    res.status(201).json({
        
      message: 'User created successfully',
      user: {
        name: user.name,
        email: user.email,
        role: user.role
      },
      token
    });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
};


export const loginController = async (req, res) => {
  const { email, password } = req.body;

  const user = await userModel.findOne({ email }).select('+password');

  if (!user) {
    return res.status(401).json({ errors: 'Invalid credentials' });
  }

  const isMatch = await user.isValidPassword(password);
  if (!isMatch) {
    return res.status(401).json({ errors: 'Invalid credentials' });
  }

  const token = user.generateJWT();

  // Send role, name, email back to frontend
  res.status(200).json({
    user: {
      name: user.name,
      email: user.email,
      role: user.role,
    },
    token
  });
};





export const profileController = async (req, res) => {

    res.status(200).json({
        user: req.user
    });

}

export const logoutController = async (req, res) => {
    try {

        const token = req.cookies.token || req.headers.authorization.split(' ')[ 1 ];

        redisClient.set(token, 'logout', 'EX', 60 * 60 * 24);

        res.status(200).json({
            message: 'Logged out successfully'
        });


    } catch (err) {
        console.log(err);
        res.status(400).send(err.message);
    }
}

export const getAllUsersController = async (req, res) => {
    try {

        const loggedInUser = await userModel.findOne({
            email: req.user.email
        })

        const allUsers = await userService.getAllUsers({ userId: loggedInUser._id });

        return res.status(200).json({
            users: allUsers
        })

    } catch (err) {

        console.log(err)

        res.status(400).json({ error: err.message })

    }
}
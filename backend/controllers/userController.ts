import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import validator from 'validator';
import sanitizeHtml from 'sanitize-html';
import createError from 'http-errors';
import User from '../models/userModel';
import { generateToken } from '../authUtils';

// login
export const getUserByEmailAndPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    let { email } = req.body;
    const { password } = req.body;
    email = email.toString();
    if (!validator.isEmail(email)) throw createError(400, `Invalid EMAIL ID: ${email}`);
    const user = await User.findOne({ email: sanitizeHtml(email) });
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(400).json({ message: 'Incorrect password' });
      return;
    }
    const token = generateToken({ id: user._id.toString(), userName: user.userName, role: user.role });
    res.status(200).json({
      id: user._id,
      username: user.userName,
      role: user.role,
      token: token
    });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

// signup
export const addUser = async (req: Request, res: Response): Promise<void> => {
  try {
    let { userName, email, mobile, password, role } = req.body;
    userName = userName.toString();
    email = email.toString();
    password = password.toString();
    role = role.toString();
    mobile = mobile.toString();
    const hashedPassword = await bcrypt.hash(password.toString(), 10);
    if (!validator.isEmail(email)) {
      throw createError(400, `Invalid EMAIL ID: ${email}`);
    }
    await User.create({
      userName: sanitizeHtml(userName),
      email: sanitizeHtml(email),
      mobile: sanitizeHtml(mobile),
      password: sanitizeHtml(hashedPassword),
      role: sanitizeHtml(role)
    });
    res.status(200).json({ message: 'Success' });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

// verify email exists - used by forgot password before showing the reset fields
// this is pretty weak as-is, anyone can check if an email is registered.
// should really send an OTP/reset link to the email instead of just returning true/false
export const verifyEmail = async (req: Request, res: Response): Promise<void> => {
  try {
    let { email } = req.body;
    email = email.toString();
    if (!validator.isEmail(email)) throw createError(400, `Invalid EMAIL ID: ${email}`);
    const user = await User.findOne({ email: sanitizeHtml(email) });
    if (user) {
      res.json({ success: true });
    } else {
      res.status(200).json({ success: false });
    }
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

// reset password - no rate limiting on this right now, should add that at some point
export const resetPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    let { email } = req.body;
    const { newPassword } = req.body;
    email = email.toString();
    if (!validator.isEmail(email)) throw createError(400, `Invalid EMAIL ID: ${email}`);
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword.toString(), salt);
    await User.updateOne({ email: sanitizeHtml(email) }, { $set: { password: hashedPassword } });
    res.json({ success: true, message: 'Password reset successfully' });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

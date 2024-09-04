const User = require('../models/userSchema');
const bcrypt = require('bcryptjs');

exports.registerUser = async (req, res) => {
  const { user_name, user_email, user_password, user_mobile, user_dob } = req.body;
  try {
    if (!user_name || !user_email || !user_password || !user_mobile || !user_dob) {
      return res.status(400).json({ error: "Fill the empty fields" });
    }

    const existingEmail = await User.findOne({ user_email });
    const existingUsername = await User.findOne({ user_name });

    if (existingEmail || existingUsername) {
      return res.status(409).json({ error: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(user_password, 10);
    const createUser = await User.create({
      user_name,
      user_email,
      user_password: hashedPassword,
      user_mobile,
      user_dob,
    });

    return res.status(200).json({
      message: "User created successfully",
      data: {
        user_name,
        user_email,
        user_mobile,
        user_dob,
      },
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: err.message });
  }
};

exports.loginUser = async (req, res) => {
  const { user_name, user_password } = req.body;
  try {
    if (!user_name || !user_password) {
      return res.status(400).json({ error: "Fill the empty fields" });
    }

    const user = await User.findOne({ user_name });
    if (!user) {
      return res.status(400).json({ error: 'User not found' });
    }

    const isPasswordCorrect = await bcrypt.compare(user_password, user.user_password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ error: "Wrong Credentials" });
    }

    return res.status(200).json({
      message: "User signed in successfully",
      data: {
        user_name: user.user_name,
        user_email: user.user_email,
        user_mobile: user.user_mobile,
        user_dob: user.user_dob,
      },
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: err.message });
  }
};

exports.getUserByUsername = async (req, res) => {
  const { username } = req.params;
  try {
    const userData = await User.findOne({ user_name: username });
    if (!userData) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json(userData);
  } catch (err) {
    console.error('Error fetching user data:', err);
    res.status(500).json({ error: 'An error occurred while fetching user data' });
  }
};

exports.updateUser = async (req, res) => {
  const { username } = req.params;
  const { user_name, user_email, user_mobile, user_dob } = req.body;

  try {
    const user = await User.findOne({ user_name: username });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user_name) user.user_name = user_name;
    if (user_email) user.user_email = user_email;
    if (user_mobile) user.user_mobile = user_mobile;
    if (user_dob) user.user_dob = user_dob;

    await user.save();

    return res.status(200).json({
      message: 'User updated successfully',
      data: {
        user_name: user.user_name,
        user_email: user.user_email,
        user_mobile: user.user_mobile,
        user_dob: user.user_dob,
      },
    });
  } catch (err) {
    console.error('Error updating user data:', err);
    return res.status(500).json({ error: 'An error occurred while updating user data' });
  }
};

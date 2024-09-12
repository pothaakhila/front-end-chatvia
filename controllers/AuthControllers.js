const User = require("../modules/Users.js");
const bcrypt = require("bcryptjs"); // Ensure bcrypt is required if passwords are hashed

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const availableUser = await User.findOne({ email: email });

    if (!availableUser) {
      return res.status(401).json({
        message: "There is no account registered with this Email, Please register to Login!",
      });
    }

    // Compare hashed password
    const isMatch = await bcrypt.compare(password, availableUser.password);
    if (!isMatch) {
      return res.status(401).json({
        message: "Wrong Password, Please Enter the correct password to Login!",
      });
    }

    // Send user data (excluding password)
    const loggedUser = await User.findOne(
      { email: email },
      { _id: 1, email: 1, name: 1, profile_photo_url: 1 }
    );
    return res.status(200).json(loggedUser);
    
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

exports.signUp = async (req, res) => {
  const { email, password, name, profile_photo_url } = req.body;

  try {
    if (await User.findOne({ email: email })) {
      return res.status(400).json({
        message: "Email already exists, Try to login or use another Email to register.",
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create new user
    const user = await User.create({
      email,
      password: hashedPassword,
      name,
      profile_photo_url, // Include profile photo URL
    });

    return res.status(201).json({
      message: "User registered successfully!",
      user: {
        _id: user._id,
        email: user.email,
        name: user.name,
        profile_photo_url: user.profile_photo_url,
      },
    });
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

exports.forgotpasswordUser = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email: email });

    if (!user)
      return res.status(401).json({
        message: `User with email: ${email} doesn't exist. Please check email or Register.`,
      });
    console.log("first");
    return res.status(201).send(user);
  } catch (error) {
    return res.status(401).send({ message: error.message });
  }
};

exports.newPassword = async (req, res) => {
  const { email, confirmPassword } = req.body;

  try {
    const user = await User.findOneAndUpdate(
      { email: email },
      { password: confirmPassword }
    );

    if (!user)
      return res.status(401).error({
        message:
          "Unable to find the user with the given Email. Please RELOAD the App.",
      });

    return res
      .status(201)
      .send({ message: "Password updated Successfully! Please Login!" });
  } catch (error) {
    return res.status(401).send({ message: error.message });
  }
};


// Update getUsers function to exclude the logged-in user
exports.getUsers = async (req, res) => {
  const loggedInUserId = req.params.userId; // Extract the logged-in user's ID from request parameters

  try {
    const users = await User.find(
      { _id: { $ne: loggedInUserId } }, // Exclude the logged-in user
      { _id: 1, name: 1, profile_photo_url: 1 }
    );
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}; 

exports.updateProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    const user = await User.findByIdAndUpdate(id, updatedData, { new: true });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
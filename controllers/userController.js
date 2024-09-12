const User = require("../modules/Users.js");

exports.updateUserProfile = async (req, res) => {
  const { userId } = req.params;
  const { name, profile_photo_url } = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, profile_photo_url },
      { new: true } // Return the updated document
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found." });
    }

    return res.status(200).json({
      message: "Profile updated successfully!",
      user: {
        _id: updatedUser._id,
        email: updatedUser.email,
        name: updatedUser.name,
        profile_photo_url: updatedUser.profile_photo_url,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

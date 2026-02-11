import User from "../models/user.model.js";
import bcrypt from "bcrypt";

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select(
      "-password -refreshToken",
    );

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    let githubData = null;

    if (user.githubLink) {
      const username = user.githubLink.split("github.com/")[1];

      if (username) {
        const response = await fetch(
          `https://api.github.com/users/${username}`,
        );
        githubData = await response.json();
      }
    }
    res.status(200).json({
      user,
      githubData,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const allowedUpdates = [
      "bio",
      "skills",
      "experienceLevel",
      "availability",
      "githubLink",
      "avatar",
    ];
    const updates = Object.keys(req.body);
    const isValidOperation = updates.every((update) =>
      allowedUpdates.includes(update),
    );
    if (!isValidOperation) {
      return res.status(400).json({
        message: "Invalid updates detected",
      });
    }
    const user = await User.findByIdAndUpdate(req.userId, updates, {
      new: true,
      runValidators: true,
    }).select("-password -refreshToken");
    res.status(200).json({
      message: "Profile updated",
      user,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

export const updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        message: "Both passwords are required",
      });
    }
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const isPasswordMatch = await bcrypt.compare(
      currentPassword,
      user.password,
    );

    if (!isPasswordMatch) {
      return res.status(400).json({
        message: "Current password incorrect",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    await user.save();

    res.status(200).json({
      message: "Password updated successfully",
    });
  } catch (error) {
    console.log("Password update error:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

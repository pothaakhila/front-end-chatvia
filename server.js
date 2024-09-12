const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const usersRouter = require('./route/Users'); // Adjust path if necessary
const User = require('./modules/Users');
require("dotenv").config();

const port = process.env.PORT || 9999;
const app = express();

app.use(express.json());
app.use(cors());

// Create the upload directory if it doesn't exist
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// Serve static files from the uploads directory
app.use('/uploads', express.static(uploadDir));

// Define the Message schema
const MessageSchema = new mongoose.Schema({
  content: String,
  sender: mongoose.Schema.Types.ObjectId,
  conversationId: mongoose.Schema.Types.ObjectId,
  fileUrl: String,
  imageUrl: String,
  createdAt: { type: Date, default: Date.now },
});

const Message = mongoose.model('Message', MessageSchema);


/*
// Update user profile route
app.put('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;
    
    // Find user by ID and update
    const user = await User.findByIdAndUpdate(id, updatedData, { new: true });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});
*/
app.put('/users/:id', async (req, res) => {
  const {  id, password, confirmPassword } = req.body;

  try {
    // Find the user
    const user = await User.findById( id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check old password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Old password is incorrect' });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(confirmPassword, salt);

    // Update the password
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});


app.post("/forgotpassword", (req, res) => {
  console.log(req.body); // This should log the email
  const { email } = req.body;
  if (email === "pothaakhila11@gmail.com " || "pothaakhila275@gmail.com") {
    res.status(200).json({ name: "akhila"  });
  } else {
    res.status(404).json({ message: "User not found" });
  }
});

app.post('/newpassword', (req, res) => {
  const { email, password } = req.body;
  // Handle the new password logic here
  res.status(200).json({ message: 'Password updated successfully' });
});


app.post('/newpassword', async (req, res) => {
  const { email, password } = req.body;

  console.log('Received email:', email);
  console.log('Received password:', password);

  if (!email || !password) {
    console.error('Email or password missing in request body.');
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 12);
    console.log('Hashed password:', hashedPassword);

    const user = await User.findOne({ email });

    if (!user) {
      console.error(`User with email ${email} not found.`);
      return res.status(404).json({
        message: "Unable to find the user with the given Email. Please RELOAD the App.",
      });
    }

    const updatedUser = await User.findOneAndUpdate(
      { email: email },
      { password: hashedPassword },
      { new: true }
    );

    console.log('Updated user:', updatedUser);

    return res.status(200).json({
      message: "Password updated Successfully! Please Login!",
    });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).send({ message: error.message });
  }
});




// Upload route
app.post('/upload', upload.single('attachment'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }
  const fileUrl = `/uploads/${req.file.filename}`;
  res.json({ fileUrl });
});

// Send message route
app.post('/sendmessage', async (req, res) => {
  const { content, sender, conversationId, fileUrl, imageUrl } = req.body;

  // Validate content or attachment
  if (!content && !fileUrl && !imageUrl) {
    return res.status(400).json({ message: 'Message content or attachment is required' });
  }

  // Create a new message
  try {
    const newMessage = new Message({
      content: content ? content.trim() : '',
      sender,
      conversationId,
      fileUrl: fileUrl || null,
      imageUrl: imageUrl || null,
    });

    await newMessage.save();
    res.status(200).json(newMessage);
  } catch (error) {
    res.status(500).json({ message: 'Error saving message', error: error.message });
  }
});

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Database Connected"))
  .catch(err => console.log(err.message));

// Import and use routes
app.use(require("./route/Auth"));
app.use(require("./route/Conversation"));
app.use('/api/users', usersRouter); // Register your router

app.listen(port, () => {
  console.log(`Server running at ${port}`);
});

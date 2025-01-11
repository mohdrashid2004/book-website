import express from 'express';
import bcrypt from 'bcrypt';
import User from './models/userModel.js';

const router = express.Router();

// Signup Route
router.post('/', async (req, res) => {
    const { name, first_name, email, password } = req.body;

    try {
        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(password, 10);

        // Save the new user with the hashed password
        const newUser = new User({ name, first_name, email, password: hashedPassword });
        await newUser.save();

        // Exclude the password in the response
        const { password: _, ...userWithoutPassword } = newUser._doc;
        res.status(201).json(userWithoutPassword);
    } catch (error) {
        console.error('Signup error:', error.message);
        res.status(500).json({ message: 'An error occurred during signup' });
    }
});



// Login Route
router.post('/login', async (req, res) => {
    console.log('Login request received:', req.body);

    try {
        const { email, password } = req.body;

        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
            console.log('User not found:', email);
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Log hashed password from DB and provided password
        console.log('Hashed password in DB:', user.password);
        console.log('Provided password:', password);

        // Compare the provided password with the hashed password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        console.log('Password match:', isPasswordValid);

        if (!isPasswordValid) {
            console.log('Invalid password');
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Exclude the password from the response
        const { password: _, ...userWithoutPassword } = user._doc;
        res.json(userWithoutPassword);
    } catch (error) {
        console.error('Error during login:', error.message);
        res.status(500).json({ message: 'An error occurred during login' });
    }
});

export default router;

import User from '../models/User.js';
import jwt from 'jsonwebtoken';

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

export async function register(req, res) {
  try {
    const { name, email, password } = req.body;
    
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'All fields required' });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }

    const user = new User({ name, email, password });
    await user.save();

    const token = generateToken(user._id);
    
    res.status(201).json({
      success: true,
      data: { token, user: { id: user._id, name: user.name, email: user.email } },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = generateToken(user._id);
    
    res.json({
      success: true,
      data: { token, user: { id: user._id, name: user.name, email: user.email } },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

export async function getProfile(req, res) {
  try {
    const user = await User.findById(req.userId)
      .select('-password')
      .populate('favorites', 'name brand price image')
      .lean();

    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

export async function toggleFavorite(req, res) {
  try {
    const user = await User.findById(req.userId);
    const { mobileId } = req.params;

    const isFav = user.favorites.includes(mobileId);
    if (isFav) {
      user.favorites.pull(mobileId);
    } else {
      user.favorites.push(mobileId);
    }
    await user.save();

    res.json({ success: true, isFavorite: !isFav });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

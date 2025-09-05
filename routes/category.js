const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth'); // We'll need to create this middleware
const Category = require('../models/Category');

// @route   POST /api/categories
// @desc    Create a new category
// @access  Private (only logged-in users can create categories)
router.post('/', auth, async (req, res) => {
  try {
    const { name, icon } = req.body;
    const newCategory = new Category({
      name,
      icon,
      user: req.user.id, // The user ID is added to the request object by the auth middleware
    });

    const category = await newCategory.save();
    res.status(201).json(category);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/categories
// @desc    Get all categories for the logged-in user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    // Find all categories that belong to the logged-in user, sorted by creation date
    const categories = await Category.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(categories);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE /api/categories/:id
// @desc    Delete a category
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    // Check if the category exists
    if (!category) {
      return res.status(404).json({ msg: 'Category not found' });
    }

    // Check if the logged-in user is the owner of the category
    if (category.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    await Category.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Category removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
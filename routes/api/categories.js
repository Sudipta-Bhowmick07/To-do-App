const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const Category = require('../../models/Category');
const Task = require('../../models/Task');

// @route    POST api/categories
// @desc     Create a new category
// @access   Private
router.post('/', auth, async (req, res) => {
  const { name, icon } = req.body;
  try {
    const newCategory = new Category({
      name,
      icon,
      user: req.user.id,
    });
    const category = await newCategory.save();
    res.json(category);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route    GET api/categories
// @desc     Get all categories for the logged-in user with task counts
// @access   Private
router.get('/', auth, async (req, res) => {
  try {
    const categories = await Category.find({ user: req.user.id }).sort({ date: -1 });

    const categoriesWithTasks = await Promise.all(
      categories.map(async (category) => {
        const taskCount = await Task.countDocuments({ category: category._id });
        return {
          ...category._doc,
          tasks: taskCount,
        };
      })
    );
    res.json(categoriesWithTasks);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route    GET api/categories/:id
// @desc     Get a single category by ID
// @access   Private
router.get('/:id', auth, async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ msg: 'Category not found' });
    }

    if (category.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    res.json(category);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route    DELETE api/categories/:id
// @desc     Delete a category and its tasks
// @access   Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ msg: 'Category not found' });
    }

    if (category.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    // Delete all tasks associated with this category
    await Task.deleteMany({ category: req.params.id });

    await category.deleteOne();

    res.json({ msg: 'Category and tasks removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
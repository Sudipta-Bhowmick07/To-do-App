const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const Task = require('../../models/Task');
const Category = require('../../models/Category');

// @route    POST api/tasks/:categoryId
// @desc     Add a new task to a category
// @access   Private
router.post('/:categoryId', auth, async (req, res) => {
  const { description } = req.body;
  try {
    const category = await Category.findById(req.params.categoryId);
    if (!category) {
      return res.status(404).json({ msg: 'Category not found' });
    }

    const newTask = new Task({
      description,
      category: req.params.categoryId,
      user: req.user.id,
    });

    const task = await newTask.save();
    res.json(task);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route    GET api/tasks/:categoryId
// @desc     Get all tasks for a category
// @access   Private
router.get('/:categoryId', auth, async (req, res) => {
  try {
    const tasks = await Task.find({
      category: req.params.categoryId,
      user: req.user.id,
    }).sort({ date: -1 });
    res.json(tasks);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route    DELETE api/tasks/:id
// @desc     Delete a task
// @access   Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ msg: 'Task not found' });
    }

    // Check if the task belongs to the user
    if (task.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    await task.deleteOne();
    res.json({ msg: 'Task removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route    PUT api/tasks/:id
// @desc     Update a task (e.g., toggle completed)
// @access   Private
router.put('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
  
    if (!task) {
      return res.status(404).json({ msg: 'Task not found' });
    }
  
    // Check if the task belongs to the user
    if (task.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }
  
    task.completed = !task.completed;
  
    await task.save();
    res.json(task);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
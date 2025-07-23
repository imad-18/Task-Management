import express from 'express';
import { Task } from '../models/task';

const router = express.Router();

let tasks: Task[] = [];
let idCounter = 1;

// GET all tasks
router.get('/', (req, res) => {
  res.json(tasks);
});

// POST create a new task
router.post('/', (req, res) => {
  const { title, description } = req.body;
  if (!title || !description) {
    return res.status(400).json({ message: 'Title and description are required' });
  }

  const newTask: Task = {
    id: idCounter++,
    title,
    description,
    status: 'pending',
  };

  tasks.push(newTask);
  res.status(201).json(newTask);
});

// DELETE a task by ID
router.delete('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  tasks = tasks.filter(task => task.id !== id);
  res.status(200).json({ message: 'Task deleted' });
});

// PATCH update task status
router.patch('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { status } = req.body;

  const task = tasks.find(t => t.id === id);
  if (!task) {
    return res.status(404).json({ message: 'Task not found' });
  }

  if (status !== 'pending' && status !== 'completed') {
    return res.status(400).json({ message: 'Invalid status value' });
  }

  task.status = status;
  res.json(task);
});

export default router;

const { Router } = require('express');
const { validateEmail, validatePassword } = require('../middlewares/validateLogin');
const generateToken = require('../utils/generateToken');

const loginRoute = Router();

loginRoute.post('/', validateEmail, validatePassword, async (_req, res) => {
  try {
    const token = generateToken();
    res.status(200).json({ token });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = loginRoute;

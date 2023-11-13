const { Router } = require('express');
const { getAllTalkers, searchTalker, getTalkerById,
  addTalker, updateTalker, deleteTalker, updateRate } = require('../db/talkerFS');
const { findAll } = require('../db/talkerDB');
const validateToken = require('../middlewares/validateToken');
const { validateRateParam, validateDateParam } = require('../middlewares/validateSearch');
const { validateName, validateAge,
  validateTalk, validateWatchedAt, validateRate } = require('../middlewares/validateTalker');
const validateRatePatch = require('../middlewares/validatePatch');

const talkerRoute = Router();

talkerRoute.get('/', async (req, res) => {
  try {
    const talkers = await getAllTalkers();
    return talkers ? res.status(200).json(talkers) : res.status(200).json([]);
  } catch (error) {
    res.status(500).json(error.message);
  }
});

talkerRoute.get('/db', async (_req, res) => {
  try {
    const talkers = await findAll();
    res.status(200).json(talkers);
  } catch (error) {
    res.status(500).json(error.message);
  }
});

talkerRoute.get(
  '/search',
  validateToken,
  validateRateParam,
  validateDateParam,
  async (req, res) => {
    try {
      const { rate, q, date } = req.query;
      const talker = await searchTalker(rate, q, date);
      return res.status(200).json(talker);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
);

talkerRoute.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const talker = await getTalkerById(id);
    return talker.length === 0
      ? res.status(404).json({ message: 'Pessoa palestrante não encontrada' })
      : res.status(200).json(talker[0]);
  } catch (error) {
    res.status(500).json(error.message);
  }
});

talkerRoute.post('/', validateToken, validateName, validateAge,
  validateTalk, validateWatchedAt, validateRate, async (req, res) => {
    try {
      const body = { ...req.body };
      const talker = await addTalker(body);
      res.status(201).json(talker);
    } catch (error) {
      res.status(500).json(error.message);
    }
  });

talkerRoute.put('/:id', validateToken, validateName, validateAge,
  validateTalk, validateWatchedAt, validateRate, async (req, res) => {
    try {
      const { id } = req.params;
      const body = { ...req.body };
      const talker = await updateTalker(id, body);
      return talker
        ? res.status(200).json(talker) 
        : res.status(404).json({ message: 'Pessoa palestrante não encontrada' });
    } catch (error) {
      res.status(500).json(error.message);
    }
  });

talkerRoute.delete('/:id', validateToken, async (req, res) => {
  try {
    const { id } = req.params;
    await deleteTalker(id);
    res.status(204).end();
  } catch (error) {
    res.status(500).json(error.message);
  }
});

talkerRoute.patch(
  '/rate/:id',
  validateToken,
  validateRatePatch,
  async (req, res) => {
    try {
      const { id } = req.params;
      const rate = req.body;
      const talkers = await updateRate(id, rate);
      res.status(204).json(talkers);
    } catch (error) {
      res.status(500).json(error.message);
    }
  },
);

module.exports = talkerRoute;
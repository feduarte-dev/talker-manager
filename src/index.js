const express = require('express');
const fs = require("fs").promises;
const path = require("path");
const generateToken = require('./utils/generateToken')
const {validateEmail, validatePassword} = require('./middlewares/validateLogin')
const {validateName, validateAge, validateTalk, validateWatchedAt, validateRate} = require('./middlewares/validateTalker')
const validateToken = require('./middlewares/validateToken')
const app = express();
app.use(express.json());

const HTTP_OK_STATUS = 200;
const PORT = process.env.PORT || '3001';

const talkerPath = path.resolve(__dirname, "./talker.json");

const readTalker = async (id) => {
  try {
    const data = await fs.readFile(talkerPath);
    return JSON.parse(data);
  } catch (error) {
    console.error(`Erro ao ler o arquivo: ${error.message}`);
  }
};

app.get("/talker", async (req, res) => {
  try {
    const talkers = await readTalker();
    talkers ? res.status(200).json(talkers) : res.status(200).json([])
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.get("/talker/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const talkers = await readTalker();
    filteredTalker = talkers.filter((talker) => talker.id === Number(id));
    filteredTalker.length === 0
      ? res.status(404).send({ message: "Pessoa palestrante não encontrada" })
      : res.status(200).json(filteredTalker[0]);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.post('/login', validateEmail, validatePassword, (req, res) => {
  const user = { ...req.body };
  const token = generateToken();
  res.status(200).json({ token: token });
})

let id = 5;
app.post('/talker', validateToken, validateName, validateAge, validateTalk, validateWatchedAt, validateRate, (req, res) => {
  const talker = { ...req.body };
  id += 1
  res.status(201).json({ id, ...talker });
})

app.put("/talker/:id", validateToken, validateName, validateAge, validateTalk, validateWatchedAt, validateRate, async (req, res) => {
  try {
    const { id } = req.params;
    const updatedTalker = req.body
    const talkers = await readTalker();
    const index = talkers.findIndex((talker) => talker.id === Number(id));
    if (index === -1) {
      return res.status(404).json({ message: "Pessoa palestrante não encontrada" });
    }

    talkers[index] = { id: Number(id), ...updatedTalker };
    console.log(talkers[index]);
    await fs.writeFile(talkerPath, JSON.stringify(talkers));

    res.status(200).json({ id: Number(id), ...updatedTalker });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.delete("/talker/:id", validateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const talkers = await readTalker();
    const filteredTalkers = talkers.filter((talker) => talker.id != Number(id));
    await fs.writeFile(talkerPath, JSON.stringify(filteredTalkers));
    res.status(204).end();
  } catch (error) {
    res.status(500).send(error.message);
  }
});


// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.listen(PORT, () => {
  console.log('Online');
});

const express = require('express');
const fs = require("fs").promises;
const path = require("path");
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

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.listen(PORT, () => {
  console.log('Online');
});

const fs = require('fs').promises;
const { join } = require('path');

const dbPath = join(__dirname, '..', 'talker.json');

const readTalker = async () => {
  try {
    const data = await fs.readFile(dbPath, 'utf-8') || [];
    return JSON.parse(data);
  } catch (error) {
    console.error(`Erro ao ler o arquivo: ${error.message}`);
  }
};

const writeTalker = async (talker) => {
  try {
    await fs.writeFile(dbPath, JSON.stringify(talker));
  } catch (error) {
    console.error(`Erro ao ler o arquivo: ${error.message}`);
  }
};

const getAllTalkers = async () => {
  const talkers = await readTalker();
  return talkers;
};

const searchTalker = async (rate, q, date) => {
  const talkers = await readTalker();
  let filteredTalkers = talkers;
  if (q) {
    filteredTalkers = filteredTalkers
      .filter((talker) => talker.name.includes(q)); 
  }
  if (rate) {
    filteredTalkers = filteredTalkers
      .filter((talker) => talker.talk.rate === Number(rate)); 
  }  
  if (date) {
    filteredTalkers = filteredTalkers
      .filter((talker) => talker.talk.watchedAt === date); 
  }  
  return filteredTalkers;
};

const getTalkerById = async (id) => {
  const talkers = await readTalker();
  return talkers.filter((talker) => talker.id === Number(id));
};

const addTalker = async (talker) => {
  const talkers = await readTalker();
  const id = talkers[talkers.length - 1].id + 1;
  const newTalker = { ...talker, id };
  talkers.push(newTalker);
  await writeTalker(talkers);
  return newTalker;
};

const updateTalker = async (id, body) => {
  const talkers = await readTalker();
  const index = talkers.findIndex((talker) => talker.id === Number(id));
  if (index === -1) return false;  
  talkers[index] = { id: Number(id), ...body };
  await writeTalker(talkers);
  return talkers[index];
};

const deleteTalker = async (id) => {
  const talkers = await readTalker();
  const filteredTalkers = talkers.filter((talker) => talker.id !== Number(id));
  await writeTalker(filteredTalkers);
};

const updateRate = async (id, rate) => {
  const talkers = await readTalker();
  const index = talkers.findIndex((talker) => talker.id === Number(id));
  talkers[index].talk.rate = rate.rate;
  await writeTalker(talkers);
};

module.exports = {
  getAllTalkers,
  searchTalker,
  getTalkerById,
  addTalker,
  updateTalker,
  deleteTalker,
  updateRate,
};
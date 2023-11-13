const connection = require('./connection');

const findAll = async () => {
  const [result] = await connection.execute('SELECT * FROM talkers');
  const fixedFormat = result.map((talker) => {
    const { name, age, id, talk_rate: rate, talk_watched_at: watchedAt } = talker;
    const talkInfo = {
      watchedAt,
      rate,
    };
    return { name, age, id, talk: talkInfo };
  });
  return fixedFormat;
};

module.exports = { findAll };

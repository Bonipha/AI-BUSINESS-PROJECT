const { connectDatabase } = require('./database');

async function logout(token) {
  if (!token) {
    return false;
  }

  const database = await connectDatabase();
  const result = await database.collection('sessions').deleteOne({ token });
  return result.deletedCount === 1;
}

module.exports = { logout };

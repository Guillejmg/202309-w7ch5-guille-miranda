import mongoose from 'mongoose'
import 'dotenv/config';

export const dbConnect = () => {
  const user = process.env.USER_DB;
  const password = process.env.PASSWD_DB;
  const cluster = 'cluster0.2kozwzv.mongodb.net';
  const dataBase = 'isdi'
  const uri = `mongodb+srv://${user}:${password}@${cluster}/${dataBase}?retryWrites=true&w=majority`;
  return mongoose.connect(uri);
}

import { createServer} from 'http'
import { app } from './app.js';
import createDebug from 'debug';
import { dbConnect } from './db.connect.js';


const debug = createDebug('W7E:index')

const PORT = process.env.PORT || 3030;

const server = createServer(app);
debug('starting server');

dbConnect()
.then((mongoose) => {
  server.listen(PORT);
  debug('Connected to DB:', mongoose.connection.db.databaseName)
  }).catch((error)=>server.emit(error))

server.on('listening', () => {
  debug('listening. on port', PORT);
})

server.on('error', (error) => {
  debug(`Error ${error.message}`);
});

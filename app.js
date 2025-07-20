import express from 'express';
import dotenv from 'dotenv';
import connectToDB from './config/db.js';
import authorsRoute from './routes/authors.js';
import booksRoute from './routes/books.js';
import usersRoute from './routes/users.js';
import authRoute from './routes/auth.js';
import passwordRoute from './routes/password.js'

dotenv.config();
const PORT = process.env.PORT;

const app = express();

await connectToDB();

app.use(express.json());

app.use('/authors', authorsRoute);
app.use('/books', booksRoute);
app.use('/users', usersRoute);
app.use('/password', passwordRoute);
app.use('/auth', authRoute);

app.listen(PORT, () => {
  console.log(`App running in: http://localhost:${PORT}`);
})
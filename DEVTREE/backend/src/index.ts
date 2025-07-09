import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import colors from 'colors';

import db from './config/db';
import routes from './routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// DB connection
db();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Rutas
app.use('/', routes);

// Start
app.listen(PORT, () => {
  console.log(colors.cyan.bold(`Servidor backend escuchando en el puerto ${PORT}`));
});

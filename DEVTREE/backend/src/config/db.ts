import mongoose from 'mongoose';

const db = async () => {
  try {
    const conn = await mongoose.connect(process.env.DATABASE_URL || '');
    console.log('MongoDB conectado:', conn.connection.name);
  } catch (error) {
    console.error('Error de conexión a MongoDB:', error);
    process.exit(1);
  }
};

export default db;

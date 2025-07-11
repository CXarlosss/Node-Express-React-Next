import { Request, Response } from 'express';
import User, { IUser } from '../models/User'; // Importa IUser para el tipado
import { generateToken } from '../utils/generateToken';
import * as mongoose from 'mongoose'; // Importa mongoose para HydratedDocument y Types

export const registerUser = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'El usuario ya existe' });
    }

    const newUser = await User.create({ name, email, password });
    // 🔥 CORRECCIÓN: Explicitamente casteamos newUser a mongoose.HydratedDocument<IUser>
    const user = newUser as mongoose.HydratedDocument<IUser>;

    res.status(201).json({
      // 🔥 CORRECCIÓN FINAL: Casteamos user._id a mongoose.Types.ObjectId
      _id: (user._id as mongoose.Types.ObjectId).toString(), 
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken((user._id as mongoose.Types.ObjectId).toString()), 
    });
  } catch (error) {
    console.error("Error al registrar usuario:", error); 
    res.status(500).json({ message: 'Error al registrar usuario', error: (error as Error).message });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const foundUser = await User.findOne({ email });
    // 🔥 CORRECCIÓN: Explicitamente casteamos foundUser a mongoose.HydratedDocument<IUser>
    const user = foundUser as mongoose.HydratedDocument<IUser>;

    // Verificamos si el usuario existe y si la contraseña es correcta
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    res.json({
      // 🔥 CORRECCIÓN FINAL: Casteamos user._id a mongoose.Types.ObjectId
      _id: (user._id as mongoose.Types.ObjectId).toString(), 
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken((user._id as mongoose.Types.ObjectId).toString()), 
    });
  } catch (error) {
    console.error("Error al iniciar sesión:", error); 
    res.status(500).json({ message: 'Error al iniciar sesión', error: (error as Error).message });
  }
};

import { Schema, model, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

// Exporta la interfaz IUser.
// Document ya incluye la propiedad _id de tipo ObjectId, así que no es necesario redeclararla.
export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: 'user' | 'admin';
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
  },
  { timestamps: true }
);

// Hash antes de guardar
userSchema.pre('save', async function (next) {
  // Solo hashear si la contraseña ha sido modificada (o es nueva)
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Método para comparar contraseñas
userSchema.methods.comparePassword = async function (candidatePassword: string) {
  // 'this.password' se refiere a la contraseña hasheada almacenada en el documento
  return await bcrypt.compare(candidatePassword, this.password);
};

// Exporta el modelo User como exportación por defecto.
const User = model<IUser>('User', userSchema);
export default User;

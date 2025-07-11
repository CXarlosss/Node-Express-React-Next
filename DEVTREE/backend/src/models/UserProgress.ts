import { Schema, model, Types } from 'mongoose';

const userProgressSchema = new Schema({
  user: { type: Types.ObjectId, ref: 'User', required: true },
  node: { type: Types.ObjectId, ref: 'Node', required: true },
  completed: { type: Boolean, default: false },
  completedAt: { type: Date },
}, { timestamps: true });

export default model('UserProgress', userProgressSchema);

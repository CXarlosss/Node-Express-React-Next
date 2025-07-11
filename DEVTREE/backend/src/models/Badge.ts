// src/models/Badge.ts
import { Schema, model, Document } from 'mongoose';

export interface IBadge extends Document {
  code: string;
  title: string;
  description: string;
  icon?: string;
}

const badgeSchema = new Schema<IBadge>(
  {
    code: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    icon: { type: String },
  },
  { timestamps: true }
);

export default model<IBadge>('Badge', badgeSchema);

// In your models/Tree.ts (or Tree.js)
import { Schema, model, Document, Types } from 'mongoose';

export interface ITree extends Document {
  name: string;
  description?: string;
  isPublic: boolean;
  nodes: Types.ObjectId[];
  owner: Types.ObjectId;
  tags?: string[];
  createdAt?: Date; // Added automatically by timestamps
  updatedAt?: Date; // Added automatically by timestamps
  // If you add view/like counts later:
  // views?: number;
  // likes?: number;
}

const treeSchema = new Schema<ITree>({
  name: { type: String, required: true },
  description: { type: String },
  isPublic: { type: Boolean, default: false },
  nodes: [{ type: Schema.Types.ObjectId, ref: 'Node' }],
  owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  tags: [{ type: String }],
}, {
  timestamps: true // ✅ Make sure this is present to track createdAt and updatedAt
});

export default model<ITree>('Tree', treeSchema);
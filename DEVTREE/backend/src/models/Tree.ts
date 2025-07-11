import { Schema, model, Document, Types } from 'mongoose';

export interface ITree extends Document {
  _id: Types.ObjectId;
  name: string;
  description?: string;
  owner: Types.ObjectId;
  nodes: Types.ObjectId[];
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const treeSchema = new Schema<ITree>(
  {
    name: { type: String, required: true },
    description: { type: String },
    owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    nodes: [{ type: Schema.Types.ObjectId, ref: 'Node' }],
    isPublic: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default model<ITree>('Tree', treeSchema);
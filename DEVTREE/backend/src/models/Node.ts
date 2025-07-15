import { Schema, model, Document, Types } from 'mongoose';

export interface INode extends Document {
  _id: Types.ObjectId;
  title: string;
  description?: string;
  parent?: Types.ObjectId;
  tags?: string[];
  children?: Types.ObjectId[];
  type: 'idea' | 'recurso' | 'skill';
  createdBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  tree: Types.ObjectId;

}

const nodeSchema = new Schema<INode>(
  {
    title: { type: String, required: true },
    description: { type: String },
    parent: { type: Schema.Types.ObjectId, ref: 'Node' },
    tags: [{ type: String }],
    children: [{ type: Schema.Types.ObjectId, ref: 'Node' }],
    type: { type: String, enum: ['idea', 'recurso', 'skill'], required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    tree: { type: Schema.Types.ObjectId, ref: 'Tree', required: true }, // 👈 AÑADE ESTO
  },
  { timestamps: true }
)


export default model<INode>('Node', nodeSchema);
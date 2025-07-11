import { Schema, model, Document, Types } from 'mongoose';

export interface IComment extends Document {
  text: string;
  author: Types.ObjectId;
  node: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const commentSchema = new Schema<IComment>(
  {
    text: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    node: { type: Schema.Types.ObjectId, ref: 'Node', required: true },
  },
  { timestamps: true }
);

export default model<IComment>('Comment', commentSchema);

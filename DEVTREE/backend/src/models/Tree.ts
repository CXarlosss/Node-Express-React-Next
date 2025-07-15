import { Schema, model, Document, Types } from 'mongoose'

export interface ITree extends Document {
  name: string
  description?: string
  isPublic: boolean
  nodes: Types.ObjectId[]
  owner: Types.ObjectId
}

const treeSchema = new Schema<ITree>({
  name: { type: String, required: true },
  description: { type: String },
  isPublic: { type: Boolean, default: false },
  nodes: [{ type: Schema.Types.ObjectId, ref: 'Node' }], // 🔥 ESTA LÍNEA ES CLAVE
  owner: { type: Schema.Types.ObjectId, ref: 'User', required: true }
})

export default model<ITree>('Tree', treeSchema)

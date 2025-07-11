import { Schema, model, Types } from 'mongoose';

const userBadgeSchema = new Schema({
  user: { type: Types.ObjectId, ref: 'User', required: true },
  badge: { type: Types.ObjectId, ref: 'Badge', required: true },
  achievedAt: { type: Date, default: Date.now },
});

userBadgeSchema.index({ user: 1, badge: 1 }, { unique: true });

export default model('UserBadge', userBadgeSchema);

import UserProgress from '../models/UserProgress'; 
import UserBadge from '../models/UserBadge';
import Badge from '../models/Badge';

export const checkAndAssignBadges = async (userId: string) => {
  const userProgress = await UserProgress.find({ user: userId });

  const completedNodes = userProgress.filter(p => p.completed).length;

  const badgeConditions = [
    { code: 'first_steps', condition: completedNodes >= 1 },
    { code: 'tree_climber', condition: completedNodes >= 10 },
  ];

  for (const { code, condition } of badgeConditions) {
    if (!condition) continue;

    const badge = await Badge.findOne({ code });
    if (!badge) continue;

    const alreadyHas = await UserBadge.findOne({ user: userId, badge: badge._id });
    if (!alreadyHas) {
      await UserBadge.create({ user: userId, badge: badge._id });
      console.log(`🎖️ Logro asignado a ${userId}: ${badge.title}`);
    }
  }
};

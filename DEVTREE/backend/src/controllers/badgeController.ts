import { Request, Response } from 'express';
import UserBadge from '../models/UserBadge';
import Badge from '../models/Badge';

export const getUserBadges = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const badges = await UserBadge.find({ user: userId }).populate('badge');
    res.json(badges);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los logros', error });
  }
};

export const getAllBadges = async (_req: Request, res: Response) => {
  try {
    const badges = await Badge.find();
    res.json(badges);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener logros disponibles', error });
  }
};

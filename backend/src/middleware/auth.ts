import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../services/authService';

export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  // El token viene en el header: "Authorization: Bearer <token>"
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    res.status(401).json({ error: 'No autorizado' });
    return;
  }

  const token = authHeader.split(' ')[1];
  const payload = verifyToken(token);

  if (!payload) {
    res.status(401).json({ error: 'Token inválido o expirado' });
    return;
  }

  next(); // todo correcto, pasamos al controller
}
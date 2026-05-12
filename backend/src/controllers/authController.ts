import { Request, Response } from 'express';
import * as authService from '../services/authService';

export function login(req: Request, res: Response): void {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400).json({ error: 'Faltan username o password' });
    return;
  }

  const token = authService.login(username, password);

  if (!token) {
    res.status(401).json({ error: 'Credenciales incorrectas' });
    return;
  }

  res.json({ token });
}
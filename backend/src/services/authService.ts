import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const JWT_SECRET = process.env.JWT_SECRET ?? 'fallback_secret';

// Generamos el hash de la contraseña una sola vez al arrancar
// En un sistema real esto estaría en la base de datos
const ADMIN_PASSWORD_HASH = bcrypt.hashSync(
  process.env.ADMIN_PASSWORD ?? 'admin123',
  10
);

export interface TokenPayload {
  username: string;
}

// Verifica usuario y contraseña y devuelve un token si son correctos
export function login(username: string, password: string): string | null {
  const validUser = username === (process.env.ADMIN_USER ?? 'admin');
  const validPass = bcrypt.compareSync(password, ADMIN_PASSWORD_HASH);

  if (!validUser || !validPass) return null;

  // El token expira en 8 horas
  return jwt.sign({ username }, JWT_SECRET, { expiresIn: '8h' });
}

// Verifica que un token es válido y devuelve su contenido
export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch {
    return null;
  }
}
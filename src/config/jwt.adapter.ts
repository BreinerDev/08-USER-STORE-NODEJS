import { envs } from "./envs";
import jwt from "jsonwebtoken";
const JWT_SEED = envs.JWT_SEED;
export class jwtAdapter {
  // DI
  static async generateToken(
    payload: string | Buffer | object,
    duration: any = "2h"
  ) {
    return new Promise((resolve) => {
      jwt.sign(payload, JWT_SEED, { expiresIn: duration }, (err, token) => {
        if (err) return resolve(null);
        resolve(token);
      });
    });
  }

  static async verifyToken<T>(token: string): Promise<T | null> {
    return new Promise((resolve) => {
      jwt.verify(token, JWT_SEED, (err, token) => {
        if (err) return resolve(null);
        resolve(token as T);
      });
    });
  }
}

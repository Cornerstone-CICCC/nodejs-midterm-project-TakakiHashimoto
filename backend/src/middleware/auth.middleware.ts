import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import env from "../config/env";

export interface AuthedRequest extends Request {
  userId?: string;
}

type jwtPayload = { userId: string };

function authRequired(req: AuthedRequest, res: Response, next: NextFunction) {
  const token = req.cookies.session;

  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "User is not authenticated" });
  }

  try {
    // jwt.verify returns payload, in this case something like {userId: "fjfwfhsfjwfhwshfwhf"}
    const payload = jwt.verify(token, env.JWT_SECRET_KEY) as jwtPayload;
    req.userId = payload.userId;
    next();
  } catch (e) {
    console.error(e);
    return res.status(401).json({ error: "Invalid token " });
  }
}

export { authRequired };

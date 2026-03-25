// ### 5.1 Auth Routes

// | Method | Route              | Description                    |
// | ------ | ------------------ | ------------------------------ |
// | POST   | `/api/auth/signup` | Register a new user            |
// | POST   | `/api/auth/login`  | Log in                         |
// | POST   | `/api/auth/logout` | Log out                        |
// | GET    | `/api/auth/me`     | Get current authenticated user |

import { Router } from "express";
import {
  signup,
  login,
  logout,
  getCurrentAuthenticatedUser,
} from "./auth.controller";
import { authRequired } from "../../middleware/auth.middleware";

const authRouter = Router();

authRouter.post("/signup", signup);
authRouter.post("/login", login);
authRouter.post("/logout", logout);
authRouter.get("/me", authRequired, getCurrentAuthenticatedUser);

export default authRouter;

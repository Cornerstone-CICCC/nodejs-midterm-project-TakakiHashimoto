import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import zxcvbn from "zxcvbn";
import db from "../../config/db";
import env from "../../config/env";
import { AuthedRequest } from "../../middleware/auth.middleware";

// ########################### SIGN UP ###########################
async function signup(req: Request, res: Response) {
  const { username, email, password } = req.body;
  console.log(`Checking Body: ${req.body}`);
  if (!username || !email || !password)
    return res.status(400).json({ error: "One of the credentials missing" });

  // checking password length
  const score = zxcvbn(password).score;
  if (score <= 2) {
    return res.status(400).json({ error: "Password is weak..." });
    console.log("Failed at Password checking");
  }

  // email validation
  const normalizedEmail = email.trim().toLowerCase();

  // hashing password
  const hasedPw = await bcrypt.hash(password, env.salt);

  try {
    const data = await db.query(
      "INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING id, username, email",
      [username, normalizedEmail, hasedPw],
    );
    console.log(data.rows);

    const userId = data.rows[0].id;

    // sign with JWT
    // JWT = header.payload.signature => It is encoded by base64 => fshfisfisf.issifhiefsfe.sifehfishifsi
    const token = jwt.sign({ userId: userId }, env.JWT_SECRET_KEY, {
      expiresIn: "7d",
    });

    // adding the token to the cookie
    res.cookie("session", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });

    return res
      .status(201)
      .json({
        success: true,
        message: "User successfully created",
        data: data.rows[0],
      });
  } catch (e) {
    console.error(e);
    return res.status(400).json({ error: "Failed to create a user" });
  }
}

// ########################### LOG IN ###########################
async function login(req: Request, res: Response) {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ error: "One of the credentials missing" });
    return;
  }

  const normalizedEmail = email.trim().toLowerCase();

  try {
    const data = await db.query(
      "SELECT id, username, email, password_hash FROM users WHERE email = ($1)",
      [normalizedEmail],
    );

    if (data.rows.length === 0) {
      return res.status(400).json({ error: "User with this email not found" });
    }

    const user = data.rows[0];

    // check password match
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(400).json({ error: "Email or Password doesn't match" });
    }

    const token = jwt.sign({ userId: user.id }, env.JWT_SECRET_KEY, {
      expiresIn: "7d",
    });
    res.cookie("session", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });

    return res
      .status(200)
      .json({ success: true, message: "Login Successful", data: user });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Failed to log you in" });
  }
}

// ########################### LOGOUT  ###########################
function logout(req: Request, res: Response) {
  res.clearCookie("session", {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
  });
  return res
    .status(200)
    .json({ success: true, message: "Successfully logged out!" });
}

// ########################### GET CURRENT USER (AUTHENTICATED  ###########################
async function getCurrentAuthenticatedUser(req: AuthedRequest, res: Response) {
  const userId = req.userId;
  try {
    const data = await db.query(
      "SELECT id, username, email FROM users WHERE id = ($1)",
      [userId],
    );
    if (data.rows.length === 0) {
      return res.status(401).json({ error: "User not Found" });
    }

    return res.status(200).json(data.rows[0]);
  } catch (e) {
    return res.status(500).json({ error: "Failed to get current user" });
  }
}

export { signup, login, logout, getCurrentAuthenticatedUser };

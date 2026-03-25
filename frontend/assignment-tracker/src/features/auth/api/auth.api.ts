import type { LoginInput, SignupInput } from "../types";

const baseUrl = `http://localhost:5000/api/auth`;

async function login(data: LoginInput) {
  const res = await fetch(`${baseUrl}/login`, {
    method: "POST",
    body: JSON.stringify(data),
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    throw new Error("Login Failed ");
  }
  const result = await res.json();

  return result;
}

async function signup(data: SignupInput) {
  const res = await fetch(`${baseUrl}/signup`, {
    method: "POST",
    body: JSON.stringify(data),
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    throw new Error("Signup failed");
  }

  return await res.json();
}

async function logout() {
  const res = await fetch(`${baseUrl}/logout`, {
    method: "POST",
    credentials: "include",
  });

  if (!res.ok) throw new Error("Logout failed");

  return await res.json();
}

async function getMe() {
  const res = await fetch(`${baseUrl}/me`, {
    method: "GET",
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Something went wrong");
  }

  return await res.json();
}

export { login, signup, logout, getMe };

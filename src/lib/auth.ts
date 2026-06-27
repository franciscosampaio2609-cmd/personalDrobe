import { useEffect, useState, useCallback } from "react";

// NOTE: This is a purely local/demo auth. Credentials live in localStorage,
// the password is lightly hashed (not cryptographically secure).
// Suitable only for personal/offline use of this prototype.

const USERS_KEY = "co.users.v1";
const SESSION_KEY = "co.session.v1";

type StoredUser = { username: string; passwordHash: string };

function hash(s: string) {
  let h = 5381;
  for (let i = 0; i < s.length; i++) h = ((h << 5) + h) ^ s.charCodeAt(i);
  return (h >>> 0).toString(36);
}

const isBrowser = typeof window !== "undefined";

const readUsers = (): StoredUser[] => {
  if (!isBrowser) return [];
  try {
    const v = window.localStorage.getItem(USERS_KEY);
    return v ? (JSON.parse(v) as StoredUser[]) : [];
  } catch {
    return [];
  }
};

const writeUsers = (users: StoredUser[]) => {
  if (!isBrowser) return;
  window.localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

export function useAuth() {
  const [username, setUsername] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!isBrowser) return;
    setUsername(window.localStorage.getItem(SESSION_KEY));
    setReady(true);
  }, []);

  const login = useCallback((u: string, p: string): string | null => {
    const uname = u.trim().toLowerCase();
    if (!uname || !p) return "Preenche utilizador e palavra-passe.";
    const users = readUsers();
    const found = users.find((x) => x.username === uname);
    if (!found) return "Utilizador não encontrado.";
    if (found.passwordHash !== hash(p)) return "Palavra-passe incorreta.";
    window.localStorage.setItem(SESSION_KEY, uname);
    setUsername(uname);
    return null;
  }, []);

  const register = useCallback((u: string, p: string): string | null => {
    const uname = u.trim().toLowerCase();
    if (!uname || uname.length < 3) return "Nome de utilizador muito curto.";
    if (!p || p.length < 4) return "Palavra-passe demasiado curta (mín. 4).";
    const users = readUsers();
    if (users.some((x) => x.username === uname)) return "Utilizador já existe.";
    users.push({ username: uname, passwordHash: hash(p) });
    writeUsers(users);
    window.localStorage.setItem(SESSION_KEY, uname);
    setUsername(uname);
    return null;
  }, []);

  const logout = useCallback(() => {
    if (!isBrowser) return;
    window.localStorage.removeItem(SESSION_KEY);
    setUsername(null);
  }, []);

  return { username, ready, login, register, logout };
}

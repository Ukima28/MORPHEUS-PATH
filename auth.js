import { supabase } from './supabase.js';

// Поточний профіль користувача (кешується)
let _profile = null;

// Логін
export async function login(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  _profile = null; // скидаємо кеш
  return data;
}

// Логаут
export async function logout() {
  _profile = null;
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
  window.location.href = '/index.html';
}

// Поточна сесія
export async function getSession() {
  const { data } = await supabase.auth.getSession();
  return data.session;
}

// Профіль поточного юзера (з кешем)
export async function getProfile() {
  if (_profile) return _profile;

  const session = await getSession();
  if (!session) return null;

  const { data, error } = await supabase
    .from('profiles')
    .select('*, organizations(id, name, code)')
    .eq('id', session.user.id)
    .single();

  if (error) return null;
  _profile = data;
  return _profile;
}

// Перевірка сесії — якщо немає, редірект на логін
export async function requireAuth() {
  const session = await getSession();
  if (!session) {
    window.location.href = '/index.html';
    return null;
  }
  return session;
}

// Перевірка ролі
export async function requireRole(...roles) {
  const profile = await getProfile();
  if (!profile || !roles.includes(profile.role)) {
    window.location.href = '/index.html';
    return null;
  }
  return profile;
}

// Редірект після логіну по ролі
export function redirectByRole(role) {
  switch (role) {
    case 'admin':
      window.location.href = '/pages/admin.html';
      break;
    default:
      window.location.href = '/pages/cases.html';
  }
}

// Слухач зміни стану авторизації
export function onAuthChange(callback) {
  supabase.auth.onAuthStateChange((event, session) => {
    _profile = null; // скидаємо кеш при будь-якій зміні
    callback(event, session);
  });
}

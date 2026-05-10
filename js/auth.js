import { supabase } from './supabase.js';

const BASE = '/MORPHEUS-PATH';

let _profile = null;

export async function login(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  _profile = null;
  return data;
}

export async function logout() {
  _profile = null;
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
  window.location.href = `${BASE}/index.html`;
}

export async function getSession() {
  const { data } = await supabase.auth.getSession();
  return data.session;
}

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

export async function requireAuth() {
  const session = await getSession();
  if (!session) {
    window.location.href = `${BASE}/index.html`;
    return null;
  }
  return session;
}

export async function requireRole(...roles) {
  const profile = await getProfile();
  if (!profile || !roles.includes(profile.role)) {
    window.location.href = `${BASE}/index.html`;
    return null;
  }
  return profile;
}

export function redirectByRole(role) {
  switch (role) {
    case 'admin':
      window.location.href = `${BASE}/pages/admin.html`;
      break;
    default:
      window.location.href = `${BASE}/pages/cases.html`;
  }
}

export function onAuthChange(callback) {
  supabase.auth.onAuthStateChange((event, session) => {
    _profile = null;
    callback(event, session);
  });
}

import { jwtDecode } from 'jwt-decode';

export function getUserFromToken() {
  const token = localStorage.getItem('token');
  if (!token) return null;

  try {
    return jwtDecode(token); // { id, username, role, email, exp }
  } catch (e) {
    return null;
  }
}

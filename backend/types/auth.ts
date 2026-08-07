// what we put in the jwt (see authUtils)
export interface JwtPayload {
  id: string;
  userName: string;
  role: 'admin' | 'user';
}

import { Injectable } from '@angular/core';
import { getCookie, setCookie, removeCookie } from 'typescript-cookie';
import { jwtDecode, JwtPayload } from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  cookieName = 'token-mytasksapp';
  constructor() {}

  saveToken(token: string) {
    setCookie(this.cookieName, token, { expires: 365, path: '/' });
  }

  getToken() {
    return getCookie(this.cookieName);
  }

  removeToken() {
    removeCookie(this.cookieName);
  }

  isValidToken(): boolean {
    const token = this.getToken();
    if (!token) return false;
    const decodedToken = jwtDecode<JwtPayload>(token);
    if (decodedToken && decodedToken.exp) {
      const tokenDate = new Date(0);
      tokenDate.setUTCSeconds(decodedToken.exp);
      const today = new Date();
      return tokenDate.getTime() > today.getTime();
    }
    return false;
  }
}

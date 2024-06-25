import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { enviroment } from '@enviroments/enviroments.prod';
import { tap } from 'rxjs/operators';
import { TokenService } from './token.service';
import { ResponseLogin } from '@models/auth.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  apiUrl = enviroment.API_URL;

  constructor(private http: HttpClient, private tokenService: TokenService) {}

  login(email: string) {
    return this.http
      .get<ResponseLogin>(`${this.apiUrl}/api/users/${email}`)
      .pipe(
        tap((response) => {
          this.tokenService.saveToken(response.token);
        })
      );
  }

  register(email: string) {
    return this.http
      .post<ResponseLogin>(`${this.apiUrl}/api/users`, { email })
      .pipe(
        tap((response) => {
          this.tokenService.saveToken(response.token);
        })
      );
  }

  logout() {
    this.tokenService.removeToken();
  }
}

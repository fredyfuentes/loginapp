import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UsuarioModel } from '../models/usuario.model';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private url = 'https://www.googleapis.com/identitytoolkit/v3/relyingparty';
  private apiKey = 'AIzaSyAWOJkWfjhY5jwmH2PmKA8T5e0ztieIkW4';
  userToken: string;
  //Crear Nuevo Usuario
  ///signupNewUser?key=[API_KEY]

  //Login
  ///verifyPassword?key=[API_KEY]

  constructor(private http: HttpClient) { 
    this.getToken();
  }

  logout() {
    localStorage.removeItem('token');
  }

  login(usuario: UsuarioModel) {
    const authData = {
      ...usuario,
      returnSecureToken: true
    };
    return this.http.post(`${this.url}/verifyPassword?key=${this.apiKey}`, authData).pipe(
      map(resp => {{
        this.saveToken(resp['idToken']);
        return resp;
      }})
    );
  }

  singup(usuario: UsuarioModel) {
    /*const authData = {
      email: usuario.email,
      password: usuario.password,
      returnSecureToken: true
    };*/
    const authData = {
      ...usuario,
      returnSecureToken: true
    };

    return this.http.post(`${this.url}/signupNewUser?key=${this.apiKey}`, authData).pipe(
      map(resp => {{
        this.saveToken(resp['idToken']);
        return resp;
      }})
    );
  }

  private saveToken(idToken: string) {
    this.userToken = idToken;
    localStorage.setItem('token', idToken);
    let today = new Date();
    today.setSeconds(3600);
    localStorage.setItem('expire', today.getTime().toString());
  }

  getToken() {
    if(localStorage.getItem('token')) {
      this.userToken = localStorage.getItem('token');
    } else {
      this.userToken = '';
    }
  }

  isAuthenticated(): boolean {
    if (this.userToken.length < 2){
      return false;
    }

    const expire = Number(localStorage.getItem('expire'));

    const expireDate = new Date();
    expireDate.setTime(expire);

    if (expireDate > new Date()) {
      return true;
    } else {
      return false;
    }
  }
}

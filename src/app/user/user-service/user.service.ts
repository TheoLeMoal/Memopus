import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, catchError, of, BehaviorSubject } from 'rxjs';
import { User } from '../user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:3000/users';
  private loggedIn = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient) {}

  /**
   * Connecte l'utilisateur
   * @param username 
   * @param password 
   * @returns 
   */
  login(username: string, password: string): Observable<boolean> {
    return this.http.get<User[]>(this.apiUrl).pipe(
      map(users => {
        const user = users.find(user => user.username === username && user.password === password);
        if (user) {
          this.loggedIn.next(true);
          return true;
        } else {
          this.loggedIn.next(false);
          return false;
        }
      }),
      catchError(() => {
        this.loggedIn.next(false);
        return of(false);
      })
    );
  }

  /**
   * Permet de se déconnecter
   */
  logout(): void {
    this.loggedIn.next(false);
  }

  /***
   * Permet de vérifier si l'utilisateur est connecté
   */
  isLoggedIn(): boolean {
    return this.loggedIn.value;
  }
}

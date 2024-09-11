import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Column } from '../column';

@Injectable({
  providedIn: 'root'
})
export class ColumnService {
  private apiUrl = 'http://localhost:3000/columns';

  constructor(private http: HttpClient) {}

  /**
   * Récupère les columns
   * @returns 
   */
  getColumns(): Observable<Column[]> {
    return this.http.get<Column[]>(this.apiUrl);
  }
}
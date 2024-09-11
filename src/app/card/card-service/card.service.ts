import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Card } from '../card';

@Injectable({
  providedIn: 'root'
})
export class CardService {

  private apiUrl = 'http://localhost:3000/cards';

  constructor(private http: HttpClient) {}

  /**
   * Recupère les cartes dans le json
   * @returns 
   */
  getCards(): Observable<Card[]> {
    return this.http.get<Card[]>(this.apiUrl);
  }

  /**
   * Ajouter une carte sur le json
   * @param card 
   * @returns 
   */
  createCard(card: Card): Observable<Card> {
    return this.http.post<Card>(this.apiUrl, card);
  }

  /**
   * Modifier une carte du json
   * @param id 
   * @param card 
   * @returns 
   */
  updateCard(id: string, card: Card): Observable<Card> {
    return this.http.put<Card>(`${this.apiUrl}/${id}`, card);
  }

  /**
   * Supprimer une carte du json
   * @param id 
   * @returns 
   */
  deleteCard(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  /**
   * Récupérer les cartes par rapport a leur tag
   * @param tagId 
   * @returns 
   */
  getCardsByTag(tagId: string): Observable<Card[]> {
    return this.http.get<Card[]>(`${this.apiUrl}?tag=${tagId}`);
  }
}

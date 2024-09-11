import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Tag } from '../tag';

@Injectable({
  providedIn: 'root'
})
export class TagService {
  private apiUrl = 'http://localhost:3000/tags';

  constructor(private http: HttpClient) {}

  /**
   * Récupère les tag dans le json
   * @returns Observable<Tag[]>
   */
  getTags(): Observable<Tag[]> {
    return this.http.get<Tag[]>(this.apiUrl);
  }

  /**
   * Ajoute un tag au json
   * @param tag 
   * @returns Observable<Tag>
   */
  createTag(tag: Tag): Observable<Tag> {
    return this.http.post<Tag>(this.apiUrl, tag);
  }

  /**
   * Supprime un tag du json
   * @param id 
   * @returns Observable<void>
   */
  deleteTag(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  /**
   * Modifie un tag du json
   * @param tagId 
   * @param updatedTag 
   * @returns Observable<Tag>
   */
  updateTag(tagId: string, updatedTag: Tag): Observable<Tag> {
    return this.http.put<Tag>(`${this.apiUrl}/${tagId}`, updatedTag);
  }
}
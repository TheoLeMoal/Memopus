import { Component } from '@angular/core';
import { Card } from '../../../card/card';
import { CardService } from '../../../card/card-service/card.service';
import { Column } from '../../../column/column';
import { ColumnService } from '../../../column/column-service/column.service';
import { Tag } from '../../tag';
import { TagService } from '../../tag-service/tag.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-tag',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './tag.component.html',
  styleUrl: './tag.component.css'
})
export class TagComponent {
  newTag: Tag = {label: '' };
  tags: Tag[] = [];
  columns: Column[] = [];
  cards: Card[] = [];
  tagStats: { tag: Tag, columnCounts: { [columnId: string]: number } }[] = [];
  selectedTag: Tag = { id: '', label: '' };

  constructor(private cardService: CardService, private tagService: TagService, private columnService: ColumnService) {}

  ngOnInit(): void {
    this.loadTags()

    this.columnService.getColumns().subscribe(columns => {
      this.columns = columns;
      this.fetchData();
    });

    this.cardService.getCards().subscribe(cards => {
      this.cards = cards;
      this.fetchData();
    });
  }

  /**
   * Stocke le tag lors de l'ouverture du modal de modification
   * @param tag 
   */
  openEditModal(tag: Tag): void {
    this.selectedTag = { ...tag };
  }

  /**
   * Modification d'un tag
   */
  updateTag() {
    this.tags = this.tags.filter(tag => tag.id !== this.selectedTag.id);
    this.tags.push(this.selectedTag)
    this.tagService.updateTag(this.selectedTag.id!, this.selectedTag).subscribe();
    this.fetchData();
  }

  /**
   * Calcule le nombre délement dans les column de chaque tag
   */
  fetchData(): void {
    if (this.tags.length > 0 && this.columns.length > 0 && this.cards.length > 0) {
      this.tagStats = this.tags.map(tag => ({
        tag,
        columnCounts: this.columns.reduce((acc, column) => {
          if (column.id != undefined) {
            acc[column.id] = this.cards.filter(card => card.tag === tag.id && card.column === column.id).length;
          }
          return acc;
        }, {} as { [columnId: string]: number })
      }));
    }
  }

  /**
   * Ajoute un tag dans le json et dans le tableau
   */
  addTag(): void {
    this.tagService.createTag(this.newTag).subscribe(
      (tag) => {
        this.tags.push(tag)
        this.newTag = {label: '' };
        this.fetchData();
      },
      (error) => {
        console.error('Erreur lors de la création du tag :', error);
      }
    );
  }

  /**
   * Charge les tags et les met dans un tableau
   */
  loadTags(): void {
    this.tagService.getTags().subscribe(tags => {
      this.tags = tags;
      this.fetchData();
    });
  }

  /**
   * Ouvre le modal de création de tag
   */
  openTagModal(): void {
    this.newTag = {label: '' };
  }

  /**
   * Supprime le tag et les cards associé
   * @param tagId 
   */
  deleteTag(tagId: string): void {
    this.cardService.getCardsByTag(tagId).subscribe(cards => {
      const deletedCards = cards;
      deletedCards.forEach((card) => {
        if (card.id){
          this.cardService.deleteCard(card.id).subscribe();
        }
      });
    });
    this.tagService.deleteTag(tagId).subscribe(tags => {
      this.tags = this.tags.filter(tag => tag.id !== tagId);
      this.fetchData();
    });
  }
}
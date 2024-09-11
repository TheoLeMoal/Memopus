import { Component, OnInit } from '@angular/core';
import { CardService } from '../card-service/card.service';
import { ColumnService } from '../../column/column-service/column.service';
import { TagService } from '../../tag/tag-service/tag.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Card } from "../card"
import { Tag } from "../../tag/tag"
import { Column } from "../../column/column"
import { ActivatedRoute } from '@angular/router';
import * as stringSimilarity from "string-similarity";


@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './card.component.html',
  styleUrl: './card.component.css'
})
export class CardComponent implements OnInit {
  showAnswer: boolean = false;
  cards: Card[] = [];
  tags: Tag[] = [];
  filteredCards: Card[] = [];
  columns: Column[] = [];
  newCard: Card = {question: '', answer: '', description: '', tag: "0", column: "0", showAnswer: false};
  currentColumnId: string | undefined;
  selectedTagId: string | null = null;

  constructor(
    private cardService: CardService,
    private tagService: TagService,
    private columnService: ColumnService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loadCards();
    this.loadTags();
    this.loadColumns();

    this.route.params.subscribe(params => {
      this.selectedTagId = params['tagId'] || null;
      this.applyFilter();
    });
  }

  /**
   * Permet de voir la réponse d'une card
   */
  toggleAnswer(cardId: string): void {
    const index = this.cards.findIndex(card => card.id === cardId);
    this.cards[index].showAnswer = !this.cards[index].showAnswer;
  }

  /**
   * Ouvre le modal
   * @param columnId
   */
  openModal(columnId: string): void {
    this.currentColumnId = columnId;
    this.newCard.column = columnId;
  }

  /**
   * Charge les cards
   */
  loadCards(): void {
    this.cardService.getCards().subscribe((cards) => {
      this.cards = cards;
      this.applyFilter();
    });
    this.applyFilter();
  }

  /**
   * Charge les tags
   */
  loadTags(): void {
    this.tagService.getTags().subscribe(tags => this.tags = tags);
  }

  /**
   * Charge les column
   */
  loadColumns(): void {
    this.columnService.getColumns().subscribe(columns => this.columns = columns);
  }

  /**
   * Ajoute une carte dans le tableau et dans le json
   */
  addCard(): void {
    this.cardService.createCard(this.newCard).subscribe(card => {
      this.cards.push(card);
      this.newCard = {question: '', answer: '', description: '', tag: "0", column: "0",showAnswer: false};
      this.applyFilter();
    });
  }

  /**
   * Applique un filtre
   */
  applyFilter(): void {
    if (this.selectedTagId) {
      this.filteredCards = this.cards.filter(card => card.tag === `${this.selectedTagId}`);
    } else {
      this.filteredCards = this.cards;
    }
  }

  /**
   * Récupère les card d'une column
   * @param columnId 
   * @returns 
   */
  getCardsByColumn(columnId: string): Card[] {
    return this.filteredCards.filter(card => card.column === columnId);
  }

  /**
   * Récupère le label du tag
   * @param tagId 
   * @returns 
   */
  getTagLabel(tagId: string): string {
    const tag = this.tags.find(tag => tag.id === tagId);
    return tag ? tag.label : 'Unknown';
  }

  /**
   * Déplace la carte d'une column à une autre
   * @param cardId 
   * @param direction 
   * @returns 
   */
  moveCard(cardId: string, direction: 'left' | 'right'): void {
    // Trouver la carte à déplacer
    const card = this.cards.find(c => c.id === cardId);
    if (!card) {
      console.error(`Carte avec l'ID ${cardId} non trouvée.`);
      return;
    }
  
    // Trouver l'index de la colonne actuelle
    const currentColumnIndex = this.columns.findIndex(col => col.id === card.column);
    if (currentColumnIndex === -1) {
      console.error(`Colonne avec l'ID ${card.column} non trouvée.`);
      return;
    }
  
    // Calculer le nouvel index de la colonne
    let newColumnIndex = currentColumnIndex;
    if (direction === 'left' && currentColumnIndex > 0) {
      newColumnIndex--;
    } else if (direction === 'right' && currentColumnIndex < this.columns.length - 1) {
      newColumnIndex++;
    }
  
    // Mettre à jour la colonne de la carte si le nouvel index est valide et différent de l'index actuel
    if (newColumnIndex !== currentColumnIndex) {
      const newColumn = this.columns[newColumnIndex];
      if (newColumn && newColumn.id && card.id) {
        // Mettre à jour la carte avec la nouvelle colonne
        this.cardService.updateCard(card.id, { ...card, column: newColumn.id }).subscribe({
          next: () => {
            console.log(`Carte ${cardId} déplacée vers la colonne ${newColumn.id}`);
            // Réactualiser la liste des cartes pour refléter les changements
            this.loadCards();
          },
          error: (err) => console.error('Erreur lors de la mise à jour de la carte:', err)
        });
      } else {
        console.error('Nouvelle colonne non trouvée ou invalide.');
      }
    } else {
      console.log('La carte est déjà dans la colonne cible.');
    }
  }

  proposeAnswer(cardId: string, userAnswer: string): void {
    const card = this.cards.find(c => c.id === cardId);
    
    if (card) {
      const similarity = stringSimilarity.compareTwoStrings(userAnswer, card.answer);
      const threshold = 0.8;
      card.userAnswer = userAnswer;
      card.comparisonResult = similarity > threshold ? 'Correct!' : 'Incorrect.';
    }
  }
}
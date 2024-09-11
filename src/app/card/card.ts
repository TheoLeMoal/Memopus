export interface Card {
  id?: string;
  question: string;
  answer: string;
  description: string;
  tag: string;
  column: string;
  showAnswer: boolean;
  userAnswer?: string;
  comparisonResult?: string;
}
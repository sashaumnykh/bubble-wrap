export interface Environment {
  production: boolean;
  mode: 'web' | 'bot';
  rows?: number;
  cols?: number;
} 
import { randomInt } from '~/helpers';

export const measurerText = (percentage: number, measurerType: string): string => {
  return `Você está ${percentage}% ${measurerType} hoje`;
};

export const counterText = (length: number): string => {
  return `A mensagem contem ${length} letras`;
};

export const shipText = (): string => ` tem ${randomInt(100)}% de chance de ficarem juntos 🥰`;

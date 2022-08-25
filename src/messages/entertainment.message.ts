import { randomInt } from "../helpers";

export const measurerText = (percentage: number, measurer_type: string) => {
  return `Você está ${percentage}% ${measurer_type} hoje`;
};

export const counterText = (length: number) => {
  return `A mensagem contem ${length} letras`;
};

export const shipText = () =>
  " tem " + randomInt(100) + "% de chance de ficarem juntos 🥰";

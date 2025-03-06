import { Wallet } from 'xrpl';

export const generateSeed = (): string => {
  const wallet = Wallet.generate();
  if (!wallet.seed) {
    throw new Error('Failed to generate XRP wallet seed');
  }
  return wallet.seed;
};

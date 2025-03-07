declare global {
  namespace NodeJS {
    interface ProcessEnv {
      s: string;
      XUMM_API_SECRET: string;
      PINATA_API_KEY: string;
      PINATA_SECRET_KEY: string;
    }
  }
}

export {};
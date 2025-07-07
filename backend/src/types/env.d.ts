declare namespace NodeJS {
    interface ProcessEnv {
        API_URL:string,
        DATABASE_URL:string,
        JWT_SECRET: string;
    }
  
}
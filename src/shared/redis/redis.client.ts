import Redis from "ioredis";

if (!process.env.REDIS_URL) {
  throw new Error("❌ Variável de ambiente REDIS_URL não definida");
}

export const redisClient = new Redis(process.env.REDIS_URL);

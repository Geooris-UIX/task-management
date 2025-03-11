import { createClient } from "redis";

const redisClient = createClient();
redisClient.connect();

export const storeOTP = async (email: string, otp: string) => {
  await redisClient.set(email, otp, { EX: 300 }); // 5 min expiry
};

export const getOTP = async (email: string) => {
    return await redisClient.get(email);
};

export const deleteOTP = async (email: string) => {
  await redisClient.del(email);
};

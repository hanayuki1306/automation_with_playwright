import * as dotenv from 'dotenv';

dotenv.config();

export function getRandomUser(): string {
  const users = process.env.SAUCE_USERS?.split(',') || [];
  if (users.length === 0) {
    throw new Error('⚠️ SAUCE_USERS is not defined in .env');
  }
  const randomIndex = Math.floor(Math.random() * users.length);
  return users[randomIndex].trim();
}

export function getPassword(): string {
  return process.env.SAUCE_PASSWORD || 'secret_sauce';
}

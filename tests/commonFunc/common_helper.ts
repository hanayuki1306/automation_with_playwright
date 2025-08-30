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

export function getRandomBookingId<T>(listIds: T[]): T {
    const randomIndex = Math.floor(Math.random() * listIds.length);
    return listIds[randomIndex];
}

export function getEnvByKey(key: string): string {
    return process.env[key] || '';
}

export function saveToEnvFile(key: string, value: string) {
    const envFilePath = '.env';
    const fs = require('fs');

    let envContent = '';
    if (fs.existsSync(envFilePath)) {
        envContent = fs.readFileSync(envFilePath, 'utf-8');
    }

    const regex = new RegExp(`^${key}=.*$`, 'm');
    if (envContent.match(regex)) {
        envContent = envContent.replace(regex, `${key}=${value}`);
    } else {
        if (envContent.length > 0 && !envContent.endsWith('\n')) {
            envContent += '\n';
        }
        envContent += `${key}=${value}\n`;
    }

    fs.writeFileSync(envFilePath, envContent);
}

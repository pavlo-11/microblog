import fs from 'fs/promises';
import path from 'path';

const DB_PATH = path.join(__dirname, '../db');

export async function readJsonFile<T>(filename: string): Promise<T> {
  const filePath = path.join(DB_PATH, filename);
  try {
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading ${filename}:`, error);
    throw error;
  }
}

export async function writeJsonFile<T>(filename: string, data: T): Promise<void> {
  const filePath = path.join(DB_PATH, filename);
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
}
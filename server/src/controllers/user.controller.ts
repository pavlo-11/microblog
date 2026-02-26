import { Request, Response } from 'express';
import { readJsonFile, writeJsonFile } from '../utils/fileUtils';
import { IUser } from '../types/contracts';
import { logger } from '../utils/logger'; // Імпорт логера

const FILE_NAME = 'user.json';

export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  
  // Логуємо спробу входу
  logger.info(`Login attempt for user: ${username}`);

  try {
    const user = await readJsonFile<IUser>(FILE_NAME);

    if (user.username === username && user.password === password) {
      user.isLoggedIn = true;
      await writeJsonFile(FILE_NAME, user);
      
      // Логуємо успіх
      logger.success(`User ${username} logged in successfully`);
      
      res.json({ success: true });
    } else {
      // Логуємо помилку входу
      logger.error(`Failed login attempt for ${username}: Invalid credentials`);
      
      res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
  } catch (error) {
    // Логуємо системну помилку
    logger.error(`System error during login: ${error}`);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    const user = await readJsonFile<IUser>(FILE_NAME);
    user.isLoggedIn = false;
    await writeJsonFile(FILE_NAME, user);
    
    // Логуємо вихід
    logger.success(`User logged out successfully`);
    
    res.json({ success: true });
  } catch (error) {
    logger.error(`System error during logout: ${error}`);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
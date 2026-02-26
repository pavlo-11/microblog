import { Request, Response } from 'express';
import { readJsonFile, writeJsonFile } from '../utils/fileUtils';
import { IPost } from '../types/contracts';
import { logger } from '../utils/logger';

const FILE_NAME = 'posts.json';

export const getPosts = async (req: Request, res: Response) => {
  try {
    // Якщо файл пустий або не існує повертаємо пустий масив
    const posts = (await readJsonFile<IPost[]>(FILE_NAME)) || [];
    res.json(posts);
  } catch (error) {
    logger.error(`Error getting posts: ${error}`);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const getPostsByAuthor = async (req: Request, res: Response) => {
  try {
    const authorId = Number(req.params.id); // Конвертування ID з URL у число
    const posts = (await readJsonFile<IPost[]>(FILE_NAME)) || [];
    
    // Фільтрування постів
    const authorPosts = posts.filter(p => Number(p.authorId) === authorId);
    res.json(authorPosts);
  } catch (error) {
    logger.error(`Error getting posts by author: ${error}`);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const createPost = async (req: Request, res: Response) => {
  try {
    const { title, body, authorId, type } = req.body;
    const posts = (await readJsonFile<IPost[]>(FILE_NAME)) || [];

    const newPost: IPost = {
      id: Date.now(),
      title,
      body,
      authorId: Number(authorId), // Збереження authorId як число
      type
    };

    posts.push(newPost);
    await writeJsonFile(FILE_NAME, posts);
    
    // Логування успішної дії через Logger
    logger.success(`New post created: "${newPost.title}" by Author ID: ${newPost.authorId}`);
    
    res.status(201).json(newPost);
  } catch (error) {
    logger.error(`Error creating post: ${error}`);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
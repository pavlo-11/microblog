import { Request, Response } from 'express';
import { readJsonFile, writeJsonFile } from '../utils/fileUtils';
import { IAuthor } from '../types/contracts';

const FILE_NAME = 'authors.json';

export const getAuthors = async (req: Request, res: Response) => {
  const authors = (await readJsonFile<IAuthor[]>(FILE_NAME)) || [];
  res.json(authors);
};

export const createAuthor = async (req: Request, res: Response) => {
  const { name, avatar } = req.body;
  const authors = (await readJsonFile<IAuthor[]>(FILE_NAME)) || [];

  if (authors.find(a => a.name === name)) {
    return res.status(400).json({ message: 'Author with that name already exists' });
  }

  const newAuthor: IAuthor = {
    id: Date.now(),
    name,
    avatar
  };

  authors.push(newAuthor);
  await writeJsonFile(FILE_NAME, authors);
  res.status(201).json(newAuthor);
};
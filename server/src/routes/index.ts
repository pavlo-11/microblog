import { Router } from 'express';
import * as AuthorController from '../controllers/author.controller';
import * as PostController from '../controllers/post.controller';
import * as UserController from '../controllers/user.controller';

const router = Router();

// Authors
router.get('/authors', AuthorController.getAuthors);
router.post('/authors', AuthorController.createAuthor);
router.get('/authors/:id/posts', PostController.getPostsByAuthor);

// Posts
router.get('/posts', PostController.getPosts);
router.post('/posts', PostController.createPost);

// User
router.post('/login', UserController.login);
router.post('/logout', UserController.logout);

export default router;
import express from 'express';
import routerController from '../controllers/router.controller';

const router = express.Router();

router.get('/', routerController.getRoute);

export default router;

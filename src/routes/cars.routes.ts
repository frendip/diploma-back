import express from 'express';
import carsController from '../controllers/cars.controller';

const router = express.Router();

router.get('/', carsController.getCars);

export default router;

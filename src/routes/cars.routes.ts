import express from 'express';
import carsController from '../controllers/cars.controller';

const router = express.Router();

router.get('/', carsController.getCars);
router.get('/:id', carsController.getCarById);
router.get('/:id/route', carsController.getCarRoute);

export default router;

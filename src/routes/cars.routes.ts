import express from 'express';
import carsController from '../controllers/cars.controller';

const router = express.Router();

router.get('/', carsController.getCars);
router.get('/:id', carsController.getCarById);
router.put('/:id', carsController.updateCar);
router.get('/:id/route', carsController.getCarRoute);
router.get('/:id/repairing-substation', carsController.getCarRepairingSubstation);

export default router;

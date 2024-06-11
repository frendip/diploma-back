import express from 'express';
import geocodeController from '../controllers/geocode.controller';

const router = express.Router();

router.get('/', geocodeController.getAddressFromCoordinates);

export default router;

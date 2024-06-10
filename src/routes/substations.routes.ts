import express from 'express';
import substationsController from '../controllers/substations.controller';

const router = express.Router();

router.get('/', substationsController.getSubstations);
router.post('/', substationsController.setSubstation);
router.get('/bases', substationsController.getBases);

export default router;
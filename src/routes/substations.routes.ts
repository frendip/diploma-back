import express from 'express';
import substationsController from '../controllers/substations.controller';

const router = express.Router();

router.get('/', substationsController.getSubstations);
router.post('/', substationsController.setSubstation);
router.delete('/', substationsController.deleteSubstation);
router.get('/bases', substationsController.getBases);
router.get('/:id', substationsController.getSubstationById);
router.put('/:id', substationsController.updateSubstation);
router.get('/:id/repair-cars', substationsController.getSubstationRepairCars);

export default router;

import express from 'express';
import substationsController from '../controllers/substations.controller';

const router = express.Router();

router.get('/', substationsController.getSubstations);

export default router;

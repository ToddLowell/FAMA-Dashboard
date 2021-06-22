import { Router } from 'express';
import controller from '../controllers/data/data';

const router = Router();

router.get('/pos_units', controller.POSUnits);
router.get('/location_data', controller.locationData);
router.get('/dashboard_headquarter', controller.headquarterData);
router.get('/dashboard_industry', controller.industryData);
router.get('/dashboard_digital', controller.digitalData);
router.get('/dashboard_operation', controller.operationData);

export default router;

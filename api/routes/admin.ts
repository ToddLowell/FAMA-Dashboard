import { Router } from 'express';
import * as controller from '../controllers/admin';

const router = Router();

router
  .route('/row')
  .post(controller.addRow)
  .put(controller.updateRow)
  .delete(controller.removeRow);

export default router;

import fs from 'fs';
import path from 'path';
import parse from 'csv-parse/lib/sync';
import { Router } from 'express';
import * as controller from '../controllers/auth';

const router = Router();

router.get('/usernames', (_req, res) => {
  const file = fs.readFileSync(
    path.join(__dirname, '../files/valid_usernames.csv'),
    {
      encoding: 'utf8',
    }
  );

  const records = parse(file);

  const bool = records.find((el: [string, string]) => el[0] === 'raaed');

  res.json(bool);
});

router.post('/login', controller.signin);
router.post('/refresh', controller.refresh);

export default router;

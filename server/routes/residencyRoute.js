import express from  'express';
const router = express.Router();
import {createResidency, getAllResidencies, getResidency} from '../controllers/resdControllers.js'

router.post('/create', createResidency);
router.get('/allresidencies', getAllResidencies);
router.get('/:id', getResidency);


export {router as residencyRoute}
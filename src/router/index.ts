import { Router } from 'express';

import authRouter from './auth';

const router = Router();

export default (): Router => {
	authRouter(router);
	return router;
};
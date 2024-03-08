import { Router } from 'express';

import authRouter from './auth';
import issueRouter from './issue';

const router = Router();

export default (): Router => {
	authRouter(router);
	issueRouter(router);
	return router;
};

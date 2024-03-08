import { Router } from 'express';

import { registerUser, userLogin } from '../controllers/auth';

export default (router: Router) => {
	router.post('/register', registerUser);
	router.post('/login', userLogin);
};

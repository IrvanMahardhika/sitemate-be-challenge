import { Request, Response, NextFunction } from 'express';
import { get, merge } from 'lodash';

import { getUserBySessionToken } from '../db/user';

export const isAuthenticated = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const sessionToken = req.cookies['MY_COOKIE'];
		if (!sessionToken) {
			return res.sendStatus(403);
		}

		const user = await getUserBySessionToken(sessionToken);
		if (!user) {
			return res.sendStatus(404);
		}

		merge(req, { identity: user });
		next();
	} catch (error) {
		console.log(error);
		return res.sendStatus(400);
	}
};

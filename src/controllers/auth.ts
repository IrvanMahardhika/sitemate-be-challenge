import { Request, Response } from 'express';

import { getUserByEmail, createUser } from '../db/user';
import { generateHash, generateSalt } from '../helpers/auth';

export const userLogin = async (req: Request, res: Response) => {
	try {
		const { email, password } = req.body;

		if (!email || !password) {
			return res.sendStatus(400);
		}

		const existingUser = await getUserByEmail(email).select(
			'+authentication.salt +authentication.password',
		);
		if (!existingUser) {
			return res.sendStatus(404);
		}

		const hashedPasswordInput = generateHash(
			existingUser.authentication?.salt || '',
			password,
		);
		if (hashedPasswordInput !== existingUser.authentication?.password) {
			return res.sendStatus(403);
		}

		const salt = generateSalt();
		const sessionToken = generateHash(salt, existingUser._id.toString());

		existingUser.authentication.sessionToken = sessionToken;
		await existingUser.save();

		res.cookie('MY_COOKIE', existingUser.authentication.sessionToken, {
			path: '/',
			domain: '127.0.0.1',
		});
		res.status(200).json(existingUser).end();
	} catch (error) {
		console.log(error);
		return res.sendStatus(400);
	}
};

export const registerUser = async (req: Request, res: Response) => {
	try {
		const { email, username, password } = req.body;

		if (!email || !username || !password) {
			return res.sendStatus(400);
		}

		const existingUser = await getUserByEmail(email);
		if (existingUser) {
			return res.sendStatus(400);
		}

		const salt = generateSalt();
		const hashedPassword = generateHash(salt, password);

		const newUser = await createUser({
			email,
			username,
			authentication: { salt, password: hashedPassword },
		});

		return res.status(201).json(newUser).end();
	} catch (error) {
		console.log(error);
		return res.sendStatus(400);
	}
};

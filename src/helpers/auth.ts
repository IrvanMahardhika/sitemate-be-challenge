import crypto from 'crypto';

import { config } from 'dotenv';
config();

const SECRET_KEY = process.env.SECRET_KEY || 'my_secret_key';

export const generateSalt = () => crypto.randomBytes(128).toString('base64');

export const generateHash = (salt: string, inputStr: string) =>
	crypto
		.createHmac('sha256', [salt, inputStr].join('/'))
		.update(SECRET_KEY)
		.digest('hex');

import { NextFunction, Request, Response } from 'express';
import Redis from 'ioredis';
const redis = new Redis();

import {
	getIssues,
	getIssueById,
	createIssue,
	updateIssueById,
	deleteIssueById,
} from '../db/issue';

export const getAllIssues = async (req: Request, res: Response) => {
	try {
		let issueList;

		const issueListFromCache = await redis.get('issueList');
		if (issueListFromCache) {
			issueList = JSON.parse(issueListFromCache);
			return res.status(200).json(issueList).end();
		}

		issueList = await getIssues();
		redis.set('issueList', JSON.stringify(issueList), 'EX', 60);
		return res.status(200).json(issueList).end();
	} catch (error) {
		console.log(error);
		return res.sendStatus(400);
	}
};

export const postIssue = async (req: Request, res: Response) => {
	try {
		const { title, description } = req.body;

		if (!title || !description) {
			return res.sendStatus(400);
		}

		const newIssue = await createIssue({
			title,
			description,
		});
		redis.del('issueList');
		return res.status(201).json(newIssue).end();
	} catch (error) {
		console.log(error);
		return res.sendStatus(400);
	}
};

export const deleteIssue = async (req: Request, res: Response) => {
	try {
		const issueId = req.params.id;
		const deletedIssue = await getIssueById(issueId);

		await deleteIssueById(issueId);
		redis.del('issueList');
		return res.status(200).json(deletedIssue).end();
	} catch (error) {
		console.log(error);
		res.sendStatus(400);
	}
};

export const updateIssue = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const issueId = req.params.id;

		const { title, description } = req.body;
		if (!title || !description) {
			return res.sendStatus(400);
		}

		await updateIssueById(issueId, { title, description });
		redis.del('issueList');
		const updatedIssue = await getIssueById(issueId);
		res.status(200).json(updatedIssue).end();
	} catch (error) {
		console.log(error);
		res.sendStatus(400);
	}
};

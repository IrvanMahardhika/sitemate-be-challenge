import { Router } from 'express';

import {
	getAllIssues,
	postIssue,
	deleteIssue,
	updateIssue,
} from '../controllers/issue';
import { isAuthenticated } from '../middlewares/auth';

export default (router: Router) => {
	router.get('/issues', isAuthenticated, getAllIssues);
	router.post('/issue', isAuthenticated, postIssue);
	router.delete('/issue/:id', isAuthenticated, deleteIssue);
	router.patch('/issue/:id', isAuthenticated, updateIssue);
};

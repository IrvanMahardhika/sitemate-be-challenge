import mongoose from 'mongoose';

const IssueSchema = new mongoose.Schema({
	title: { type: String, required: true },
	description: { type: String, required: true },
});

export const IssueModel = mongoose.model('Issue', IssueSchema);

export const getIssues = () => IssueModel.find();

export const getIssueById = (id: string) => IssueModel.findById(id);

export const createIssue = (values: Record<string, any>) =>
	new IssueModel(values).save().then((issue) => issue.toObject());

export const deleteIssueById = (id: string) => IssueModel.findByIdAndDelete(id);

export const updateIssueById = (id: string, values: Record<string, any>) =>
	IssueModel.findByIdAndUpdate(id, values);

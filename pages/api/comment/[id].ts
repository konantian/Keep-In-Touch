import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';
import { authenticated } from '../authenticated'; 
import { delete_comment } from '../../../utils/commentUtil';

export default authenticated(async function getCommentById(req : NextApiRequest, res : NextApiResponse ){

	if(req.method !== 'DELETE'){
        return res.status(405).json({error : "Method not allowed, please use DELETE"});
    }

	const deleteComment = await delete_comment(prisma, req.query.id);
	if(!deleteComment){
		return res.status(400).json({error : "Cannot delete this comment now, please try again."})
	}
	return res.status(200).json({success : "Comment has been deleted"});
  
});
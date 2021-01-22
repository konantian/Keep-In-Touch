import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';
import { authenticated } from '../authenticated'; 
import { delete_comment, get_comment_by_id } from '../../../utils/commentUtil';

export default authenticated(async function getCommentById(req : NextApiRequest, res : NextApiResponse, decoded ){

	if(req.method !== 'DELETE'){
        return res.status(405).json({error : "Method not allowed, please use DELETE"});
	}
	
	const comment = await get_comment_by_id(prisma, req.query.id);

	if(decoded.username !== comment.author.username){
        return res.status(401).json({error : "You have no permission on requested entity"});
    }

	const deleteComment = await delete_comment(prisma, req.query.id);
	if(!deleteComment){
		return res.status(400).json({error : "Cannot delete this comment now, please try again."})
	}
	return res.status(200).json({success : "Comment has been deleted"});
  
});
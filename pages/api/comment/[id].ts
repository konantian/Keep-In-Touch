import {NextApiRequest, NextApiResponse} from 'next';
import prisma from '../../../lib/prisma';
import { get_comment_by_id, delete_comment } from '../../../utils/commentUtil';

export default async function getCommentById(req : NextApiRequest, res : NextApiResponse ){

  if(req.method === 'GET'){
  	  const comment = await get_comment_by_id(prisma, req.query.id);

      return res.status(200).json(comment);
  }else if(req.method === 'DELETE'){
	  const deleteComment = await delete_comment(prisma, req.query.id);
	  if(!deleteComment){
		  return res.status(400).json({error : "Cannot delete this comment now, please try again."})
	  }
	  return res.status(200).json({success : "Comment has been deleted"});
  }
  
}
import {NextApiRequest, NextApiResponse} from 'next';
import prisma from '../../../lib/prisma';
import {get_comment_by_id} from '../../../utils/commentUtil';

export default async function getCommentById(req : NextApiRequest, res : NextApiResponse ){

  if(req.method !== 'GET'){
    return res.status(405).json({error : "Method not allowed, please use GET"});
  }

  const comment = await get_comment_by_id(prisma, req.query.id);

  return res.status(200).json(comment);
}
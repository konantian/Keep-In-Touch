import {NextApiRequest, NextApiResponse} from 'next';
import prisma from '../../../lib/prisma';
import {get_post_by_id} from '../../../utils/postUtil';

export default async function getPostById(req : NextApiRequest, res : NextApiResponse ){

  if(req.method !== 'GET'){
    return res.status(405).json({error : "Method not allowed, please use GET"});
  }

  const post = await get_post_by_id(prisma, req.query.id);

  return res.status(200).json(post);
}
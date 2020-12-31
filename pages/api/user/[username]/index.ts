import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../../lib/prisma';
import { get_user_by_username } from '../../../../utils/userUtil';

export default async function getUserByUsername(req : NextApiRequest, res : NextApiResponse ){

  if(req.method !== 'GET'){
    return res.status(405).json({error : "Method not allowed, please use GET"});
  }

  const user = await get_user_by_username(prisma, req.query);

  return res.status(200).json(user);
}
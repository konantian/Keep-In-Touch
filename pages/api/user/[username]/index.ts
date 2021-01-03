import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../../lib/prisma';
import { authenticated } from '../../authenticated';
import { get_user_by_username, update_bio } from '../../../../utils/userUtil';

export default authenticated(async function getUserByUsername(req : NextApiRequest, res : NextApiResponse ){

  if(req.method === 'GET'){
    const user = await get_user_by_username(prisma, req.query);

    return res.status(200).json(user);

  }else if(req.method === 'PATCH'){
    const updateBio = await update_bio(prisma, req.query.username, req.body.bio);
    if(updateBio){
      return res.status(200).json({success : "Profile has been updated!"});
    }
    return res.status(400).json({error : "Cannot update the profile right now"});
  }
});
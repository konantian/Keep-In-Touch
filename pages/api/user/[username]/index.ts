import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../../lib/prisma';
import { authenticated } from '../../authenticated';
import { get_profile_by_username, update_profile } from '../../../../utils/userUtil';

export default authenticated(async function getUserByUsername(req : NextApiRequest, res : NextApiResponse, decoded ){

  if(req.method === 'GET'){
    const user = await get_profile_by_username(prisma, req.query);

    return res.status(200).json(user);

  }else if(req.method === 'PATCH'){

    if(decoded.username !== req.query.username){
        return res.status(401).json({error : "You have no permission on requested entity"});
    }

    const updateProfile = await update_profile(prisma, req.query.username, req.body);
    if(updateProfile){
        return res.status(200).json({success : "Profile has been updated!"});
    }
    return res.status(400).json({error : "Cannot update the profile right now"});
  }
});
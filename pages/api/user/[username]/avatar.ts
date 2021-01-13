import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../../lib/prisma';
import { authenticated } from '../../authenticated';
import { update_avatar } from '../../../../utils/userUtil';

export default authenticated(async function updateAvatar(req : NextApiRequest, res : NextApiResponse ){

    if(req.method !== 'PATCH'){
        return res.status(405).json({error : "Method not allowed, please use PATCH"});
    }

    const updateAvatar = await update_avatar(prisma, req.query.username, req.body.avatar);
    if(updateAvatar){
      return res.status(200).json({success : "Avatar has been updated!"});
    }
    return res.status(400).json({error : "Cannot update the avatar right now"});
});
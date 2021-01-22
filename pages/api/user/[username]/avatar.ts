import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../../lib/prisma';
import { authenticated } from '../../authenticated';
import { update_profile } from '../../../../utils/userUtil';
const imageToBase64 = require('image-to-base64');

export default authenticated(async function updateAvatar(req : NextApiRequest, res : NextApiResponse, decoded ){

    if(req.method !== 'PATCH'){
        return res.status(405).json({error : "Method not allowed, please use PATCH"});
    }

    if(decoded.username !== req.query.username){
        return res.status(401).json({error : "You have no permission on requested entity"});
    }

    const avatar = req.body.avatar;
    const base64 = avatar.includes('base64') ? avatar : "data:image/jpeg;base64," +  await imageToBase64(avatar);
    
    const updateAvatar = await update_profile(prisma, req.query.username, { avatar :  base64});
    if(updateAvatar){
        return res.status(200).json({success : "Avatar has been updated!"});
    }
    return res.status(400).json({error : "Cannot update the avatar right now"});
});
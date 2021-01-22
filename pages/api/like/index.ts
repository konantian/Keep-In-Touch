import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';
import { authenticated } from '../authenticated'; 
import { update_like } from '../../../utils/likeUtil';

export default authenticated(async function Like(req : NextApiRequest, res : NextApiResponse, decoded ){

    if(req.method !== 'PATCH'){
        return res.status(405).json({error : "Method not allowed, please use PATCH"});
    }

    if(decoded.sub !== req.body.userId){
        return res.status(401).json({error : "You have no permission on requested entity"});
    }

    const updateLike = await update_like(prisma, req.body);

    return res.status(200).json(updateLike);

});
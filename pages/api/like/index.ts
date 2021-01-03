import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';
import { authenticated } from '../authenticated'; 
import { update_like } from '../../../utils/likeUtil';

export default authenticated(async function Like(req : NextApiRequest, res : NextApiResponse ){

    if(req.method !== 'PATCH'){
        return res.status(405).json({error : "Method not allowed, please use PATCH"});
    }

    const updateLike = await update_like(prisma, req.body);

    return res.status(200).json(updateLike);

});
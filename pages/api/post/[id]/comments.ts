import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../../lib/prisma';
import { authenticated } from '../../authenticated';
import { get_comments_by_post } from '../../../../utils/commentUtil';

export default authenticated(async function getCommentsByPost(req : NextApiRequest, res : NextApiResponse ){

    if(req.method !== 'GET'){
        return res.status(405).json({error : "Method not allowed, please use GET"});
    }

    const comments = await get_comments_by_post(prisma, req.query.id);

    await prisma.$disconnect();
    return res.status(200).json({comments : comments});
});
import {NextApiRequest, NextApiResponse} from 'next';
import prisma from '../../lib/prisma';
import {get_comments} from '../../utils/commentUtil';

export default async function getAllComments(req : NextApiRequest, res : NextApiResponse ){

    if(req.method !== 'GET'){
        return res.status(405).json({error : "Method not allowed, please use GET"});
    }

    const comments = await get_comments(prisma);

    await prisma.$disconnect();
    return res.status(200).json({comments : comments});
}
import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../../lib/prisma';
import { get_following} from '../../../../utils/followUtil';

export default async function getFollowing(req : NextApiRequest, res : NextApiResponse ){

    if(req.method !== 'GET'){
        return res.status(405).json({error : "Method not allowed, please use GET"});
    }

    const following = await get_following(prisma, req.query.username);

    await prisma.$disconnect();
    return res.status(200).json({following : following});
}
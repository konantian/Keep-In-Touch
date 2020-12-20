import {NextApiRequest, NextApiResponse} from 'next';
import prisma from '../../../../lib/prisma';
import { get_followers_by_user, get_following_by_user } from '../../../../utils/followUtil';

export default async function getFollow(req : NextApiRequest, res : NextApiResponse ){

    if(req.method !== 'GET'){
        return res.status(405).json({error : "Method not allowed, please use GET"});
    }

    const followers = await get_followers_by_user(prisma, req.query.username);
    const following = await get_following_by_user(prisma, req.query.username);

    await prisma.$disconnect();
    return res.status(200).json({followers : followers, following : following});
}
import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../../lib/prisma';
import { get_followers } from '../../../../utils/followUtil';

export default async function getFollower(req : NextApiRequest, res : NextApiResponse ){

    if(req.method !== 'GET'){
        return res.status(405).json({error : "Method not allowed, please use GET"});
    }

    const followers = await get_followers(prisma, req.query.username);

    await prisma.$disconnect();
    return res.status(200).json({followers : followers});
}
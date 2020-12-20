import {NextApiRequest, NextApiResponse} from 'next';
import prisma from '../../../lib/prisma';
import {if_follow} from '../../../utils/followUtil';

export default async function ifFollow(req : NextApiRequest, res : NextApiResponse){

    if(req.method !== 'GET'){
        return res.status(405).json({error : "Method not allowed, please use GET"});
    }
    
    const follow = await if_follow(prisma, req.body);

    await prisma.$disconnect();
    return res.status(200).json({status : follow});
}
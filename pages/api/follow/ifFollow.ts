import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';
import { authenticated } from '../authenticated'; 
import { if_follow } from '../../../utils/followUtil';

export default authenticated(async function ifFollow(req : NextApiRequest, res : NextApiResponse){

    if(req.method !== 'GET'){
        return res.status(405).json({error : "Method not allowed, please use GET"});
    }
    
    const follow = await if_follow(prisma, req.query);

    await prisma.$disconnect();
    return res.status(200).json({status : follow});
});
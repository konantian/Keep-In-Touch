import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';
import { authenticated } from '../authenticated'; 
import { remove_follow } from '../../../utils/followUtil';

export default authenticated(async function unFollow(req : NextApiRequest, res : NextApiResponse){

    if(req.method !== 'POST'){
        return res.status(405).json({error : "Method not allowed, please use POST"});
    }

    const deleteFollow = await remove_follow(prisma, req.body);
    if(!deleteFollow){
        await prisma.$disconnect();
        return res.status(400).json({error : "User unfollow failed, please check your data"});
    };
    await prisma.$disconnect();
    return res.status(201).json({success : "Unfollow success!"});

});
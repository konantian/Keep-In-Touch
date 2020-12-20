import {NextApiRequest, NextApiResponse} from 'next';
import prisma from '../../../lib/prisma';

export default async function addFollow(req : NextApiRequest, res : NextApiResponse){

    if(req.method !== 'POST'){
        return res.status(405).json({error : "Method not allowed, please use POST"});
    }

    const {userId, followerId} = req.body;

    const addFollow = await prisma.follow.create({
        data : {
            user : {connect : {id : userId}},
            follower : {connect : {id : followerId}}
        }
    });
    if(!addFollow){
        await prisma.$disconnect();
        return res.status(400).json({error : "User follow failed, please check your data"});
    };
    await prisma.$disconnect();
    return res.status(201).json({success : "Follow success!"});
}
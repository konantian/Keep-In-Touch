import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';
import { authenticated } from '../authenticated'; 
import { currentTime } from '../../../utils/currentTime';

export default authenticated(async function addFollow(req : NextApiRequest, res : NextApiResponse){

    if(req.method !== 'POST'){
        return res.status(405).json({error : "Method not allowed, please use POST"});
    }

    const { user, follower } = req.body;

    const addFollow = await prisma.follow.create({
        data : {
            user : {connect : {username : user}},
            follower : {connect : {username : follower}},
            followedAt : currentTime
        }
    });
    if(!addFollow){
        return res.status(400).json({error : "User follow failed, please check your data"});
    };
    return res.status(201).json({success : "Follow success!"});
});
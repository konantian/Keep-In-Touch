import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';
import { authenticated } from '../authenticated'; 
import { remove_follow } from '../../../utils/followUtil';

export default authenticated(async function unFollow(req : NextApiRequest, res : NextApiResponse, decoded){

    if(req.method !== 'POST'){
        return res.status(405).json({error : "Method not allowed, please use POST"});
    }

    if(decoded.sub !== req.body.followerId){
        return res.status(401).json({error : "You have no permission on requested entity"});
    }

    const deleteFollow = await remove_follow(prisma, req.body);
    if(!deleteFollow){
        return res.status(400).json({error : "User unfollow failed, please check your data"});
    };
    return res.status(201).json({success : "Unfollow success!"});

});
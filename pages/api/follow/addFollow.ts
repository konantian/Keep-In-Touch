import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';
import { authenticated } from '../authenticated'; 
import { add_follow } from '../../../utils/followUtil';

export default authenticated(async function addFollow(req : NextApiRequest, res : NextApiResponse, decoded){

    if(req.method !== 'POST'){
        return res.status(405).json({error : "Method not allowed, please use POST"});
    }

    if(decoded.username !== req.body.follower){
        return res.status(401).json({error : "You have no permission on requested entity"});
    }

    const addFollow = await add_follow(prisma, req.body);
    if(!addFollow){
        return res.status(400).json({error : "User follow failed, please check your data"});
    };
    return res.status(201).json({success : "Follow success!"});
});
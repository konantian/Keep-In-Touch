import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../lib/prisma';
import { authenticated } from './authenticated';
import { create_comment } from '../../utils/commentUtil';

export default authenticated(async function getAllComments(req : NextApiRequest, res : NextApiResponse, decoded ){

    if(req.method !== 'POST'){
        return res.status(405).json({error : "Method not allowed, please use POST"});
    }

    if(decoded.username !== req.body.username){
        return res.status(401).json({error : "You have no permission on requested entity"});
    }

    const addComment = await create_comment(prisma, req.body);
    if(!addComment){
        return res.status(400).json({error : "New comment cannot be created, please try again."});
    }

    return res.status(201).json({success : "New comment has been created"});
});
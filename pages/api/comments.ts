import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../lib/prisma';
import { authenticated } from './authenticated';
import { create_comment } from '../../utils/commentUtil';

export default authenticated(async function getAllComments(req : NextApiRequest, res : NextApiResponse ){

    if(req.method !== 'POST'){
        return res.status(405).json({error : "Method not allowed, please use POST"});
    }

    const addComment = await create_comment(prisma, req.body);
    if(!addComment){
        return res.status(400).json({error : "New comment cannot be created, please try again."});
    }

    await prisma.$disconnect();
    return res.status(201).json({success : "New comment has been created"});
});
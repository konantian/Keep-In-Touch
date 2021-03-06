import  { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../lib/prisma';
import { authenticated } from './authenticated';
import { create_post } from '../../utils/postUtil';

export default authenticated(async function Posts(req : NextApiRequest, res : NextApiResponse, decoded ){

    if(req.method !== 'POST'){
        return res.status(405).json({error : "Method not allowed, please use POST"});
    }

    if(decoded.username !== req.body.username){
        return res.status(401).json({error : "You have no permission on requested entity"});
    }

    const addPost = await create_post(prisma, req.body);
    if(!addPost){
        return res.status(400).json({error : "New post cannot be created, please try again."});
    }

    return res.status(201).json({success : "New post has been created"});
});

export const config = {
    api : {
        bodyParser : {
            sizeLimit : '10mb'
        }
    }
}
import  {NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../lib/prisma';
import { create_post } from '../../utils/postUtil';

export default async function Posts(req : NextApiRequest, res : NextApiResponse ){

    if(req.method !== 'POST'){
        return res.status(405).json({error : "Method not allowed, please use POST"});
    }

    const addPost = await create_post(prisma, req.body);
    if(!addPost){
        return res.status(400).json({error : "New post cannot be created, please try again."});
    }

    await prisma.$disconnect();
    return res.status(201).json({success : "New post has been created"});
}
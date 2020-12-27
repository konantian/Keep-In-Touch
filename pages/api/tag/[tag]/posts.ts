import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../../lib/prisma';
import { get_posts_by_tag } from '../../../../utils/tagUtil';

export default async function getPostsByTag(req : NextApiRequest, res : NextApiResponse ){

    if(req.method !== 'GET'){
        return res.status(405).json({error : "Method not allowed, please use GET"});
    }

    const posts = await get_posts_by_tag(prisma, req.query);

    await prisma.$disconnect();
    return res.status(200).json({posts : posts});
}
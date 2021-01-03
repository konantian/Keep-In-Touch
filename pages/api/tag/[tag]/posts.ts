import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../../lib/prisma';
import { authenticated } from '../../authenticated';
import { get_posts_by_tag } from '../../../../utils/tagUtil';

export default authenticated(async function getPostsByTag(req : NextApiRequest, res : NextApiResponse ){

    if(req.method !== 'GET'){
        return res.status(405).json({error : "Method not allowed, please use GET"});
    }

    const posts = await get_posts_by_tag(prisma, req.query);

    return res.status(200).json({posts : posts});
});
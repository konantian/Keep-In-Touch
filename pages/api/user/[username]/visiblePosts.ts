import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../../lib/prisma';
import { authenticated } from '../../authenticated';
import { get_visible_posts_by_user } from '../../../../utils/postUtil';

export default authenticated(async function getVisiblePostsByUser(req : NextApiRequest, res : NextApiResponse ){

    if(req.method !== 'GET'){
        return res.status(405).json({error : "Method not allowed, please use GET"});
    }

    const posts = await get_visible_posts_by_user(prisma, req.query.username);

    return res.status(200).json({posts : posts});
});
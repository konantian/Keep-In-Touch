import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../../lib/prisma';
import { authenticated } from '../../authenticated';
import { get_posts_by_tag } from '../../../../utils/tagUtil';

export default authenticated(async function getPostsByTag(req : NextApiRequest, res : NextApiResponse, decoded ){

    if(req.method !== 'GET'){
        return res.status(405).json({error : "Method not allowed, please use GET"});
    }

    if(decoded.username !== req.query.currentUser){
        return res.status(401).json({error : "You have no permission on requested entity"});
    }

    const posts = await get_posts_by_tag(prisma, req.query);

    return res.status(200).json({posts : posts});
});
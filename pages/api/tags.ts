import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../lib/prisma';
import { authenticated } from './authenticated';
import { get_tags } from '../../utils/tagUtil';

export default authenticated(async function getAllTags(req : NextApiRequest, res : NextApiResponse ){

    if(req.method !== 'GET'){
        return res.status(405).json({error : "Method not allowed, please use GET"});
    }

    const tags = await get_tags(prisma);
    const uniqueTags = tags.filter((tag, idx) => tags.indexOf(tag) === idx);

    return res.status(200).json({tags : uniqueTags});
})
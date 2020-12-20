import {NextApiRequest, NextApiResponse} from 'next';
import prisma from '../../../../lib/prisma';
import { get_tags_by_post } from '../../../../utils/tagUtil';

export default async function getTagsByPost(req : NextApiRequest, res : NextApiResponse ){

    if(req.method !== 'GET'){
        return res.status(405).json({error : "Method not allowed, please use GET"});
    }

    const tags = await get_tags_by_post(prisma, req.query.id);

    await prisma.$disconnect();
    return res.status(200).json({tags : tags});
}
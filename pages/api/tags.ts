import {NextApiRequest, NextApiResponse} from 'next';
import prisma from '../../lib/prisma';

export default async function getAllTags(req : NextApiRequest, res : NextApiResponse ){

    if(req.method !== 'GET'){
        return res.status(405).json({error : "Method not allowed, please use GET"});
    }

    const tags = await prisma.tag.findMany();

    await prisma.$disconnect();
    return res.status(200).json({tags : tags});
}
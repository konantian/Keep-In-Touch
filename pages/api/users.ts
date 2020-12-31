import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../lib/prisma';
import { get_users } from '../../utils/userUtil';

export default async function getAllUsers(req : NextApiRequest, res : NextApiResponse ){

    if(req.method !== 'GET'){
        return res.status(405).json({error : "Method not allowed, please use GET"});
    }

    const users = await get_users(prisma);

    await prisma.$disconnect();
    return res.status(200).json({users : users});
}
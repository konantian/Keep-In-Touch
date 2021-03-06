import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../../lib/prisma';
import { authenticated } from '../../authenticated';
import { get_followers } from '../../../../utils/followUtil';

export default authenticated(async function getFollower(req : NextApiRequest, res : NextApiResponse ){

    if(req.method !== 'GET'){
        return res.status(405).json({error : "Method not allowed, please use GET"});
    }

    const followers = await get_followers(prisma, req.query);

    return res.status(200).json({followers : followers});
});
import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../../lib/prisma';
import { authenticated } from '../../authenticated';
import { get_following } from '../../../../utils/followUtil';

export default authenticated(async function getFollowing(req : NextApiRequest, res : NextApiResponse ){

    if(req.method !== 'GET'){
        return res.status(405).json({error : "Method not allowed, please use GET"});
    }

    const following = await get_following(prisma, req.query);

    return res.status(200).json({following : following});
});
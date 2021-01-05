import { NextApiRequest, NextApiResponse } from 'next';

export default async function logout(req : NextApiRequest, res : NextApiResponse){

    if(req.method !== 'POST'){
        return res.status(405).json({error : "Method not allowed, please use POST"});
    }

    res.setHeader('Set-Cookie', 'auth=deleted; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT');

    return res.status(200).json({success : "You are logout!"});
}
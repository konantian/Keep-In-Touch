import { NextApiRequest, NextApiResponse } from 'next';
import { authenticated } from '../authenticated'; 

export default authenticated(async function Upload(req : NextApiRequest, res : NextApiResponse ){

    return res.status(200).json({success : "Avatar uploaded!"});
    
});
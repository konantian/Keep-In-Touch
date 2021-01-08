import { NextApiRequest, NextApiResponse, NextApiHandler } from 'next';
import { verify } from 'jsonwebtoken';
import { SECRET } from './secret';

export const authenticated = (fn : NextApiHandler) => 
    async (req : NextApiRequest, res : NextApiResponse) => {

    return new Promise(( resolve ) => {

        verify(req.cookies.auth!, SECRET, async (err, decoded) => {
            
            if(!err && decoded){
                return resolve(fn(req, res));
            }
            return res.status(401).json({error : "You are not authorized"});
        }
    )})     
}
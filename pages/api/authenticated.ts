import { NextApiRequest, NextApiResponse } from 'next';
import { verify } from 'jsonwebtoken';
import { SECRET } from './secret';

export const authenticated = (fn : Function) => 
    async (req : NextApiRequest, res : NextApiResponse) => {

    return new Promise(( resolve ) => {

        verify(req.cookies.auth!, SECRET, async (err, decoded) => {
            
            if(!err && decoded){
                return resolve(fn(req, res, decoded));
            }
            return res.status(401).json({error : "You are not authorized"});
        }
    )})     
}
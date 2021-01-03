const bcrypt = require('bcrypt');
import { NextApiRequest, NextApiResponse, NextApiHandler } from 'next';
import { check_username, get_user } from '../../../utils/authUtil';
import prisma from '../../../lib/prisma';
import { sign } from 'jsonwebtoken';
import { SECRET } from '../secret';
import { currentTime } from '../../../utils/currentTime';

const authenticated = (fn : NextApiHandler) => 
    async (req : NextApiRequest, res : NextApiResponse) => {
        return await fn(req,res);
}

export default authenticated(async function login(req : NextApiRequest, res : NextApiResponse){

    if(req.method !== 'POST'){
        return res.status(405).json({error : "Method not allowed, please use POST"});
    }

    const {username, password } = req.body;

    const newUsername = await check_username(prisma, username)
    if(newUsername){
        return res.status(400).json({error : "The username entered does not exist, please input again"});   
    }

    const user = await get_user(prisma, username);

    if(bcrypt.compareSync(password, user.password)){

        const updateLogin = await prisma.user.update({
            where : {username : username},
            data : {lastLogin : currentTime},
            select : {id : true}
        });
        const claims = {sub : user.id, username : user.username };
        const jwt = sign(claims, SECRET, {expiresIn : '1h'});
        return res.status(200).json({success : "Welcome back!", userId : updateLogin.id, authToken : jwt});
    }else{
        return res.status(400).json({error : "The username and password entered is not matched"});
    }
});
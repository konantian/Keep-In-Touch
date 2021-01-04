const bcrypt = require('bcrypt');
import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';
import { sign } from 'jsonwebtoken';
import { SECRET } from '../secret';
import cookie from 'cookie';
import { currentTime } from '../../../utils/currentTime';
import { check_username, get_user } from '../../../utils/authUtil';

export default async function login(req : NextApiRequest, res : NextApiResponse){

    if(req.method !== 'POST'){
        return res.status(405).json({error : "Method not allowed, please use POST"});
    }

    const { username, password } = req.body;

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
        res.setHeader('Set-Cookie', cookie.serialize('auth', jwt, {
            httpOnly : true,
            secure : process.env.NODE_ENV !== 'development',
            sameSite : 'strict',
            maxAge : 3600,
            path : '/'
        }))

        return res.status(200).json({success : "Welcome back!", userId : updateLogin.id, authToken : jwt});
    }else{
        return res.status(400).json({error : "The username and password entered is not matched"});
    }
}
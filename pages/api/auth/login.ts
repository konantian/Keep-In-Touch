const bcrypt = require('bcrypt');
import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';
import { sign } from 'jsonwebtoken';
import { SECRET } from '../secret';
import cookie from 'cookie';
import { currentTime } from '../../../utils/currentTime';
import { check_email, get_user_by_email } from '../../../utils/authUtil';

export default async function login(req : NextApiRequest, res : NextApiResponse){

    if(req.method !== 'POST'){
        return res.status(405).json({error : "Method not allowed, please use POST"});
    }

    const { email, password } = req.body;

    const newEmail = await check_email(prisma, email)
    if(newEmail){
        return res.status(400).json({error : "This email has not registered yet, please sign up first"});   
    }

    const user = await get_user_by_email(prisma, email);

    if(bcrypt.compareSync(password, user.password)){

        const updateLogin = await prisma.user.update({
            where : {email : email},
            data : {lastLogin : currentTime},
            select : {id : true}
        });
        const claims = {sub : user.id, email : user.email, username : user.username };
        const jwt = sign(claims, SECRET, {expiresIn : '1h'});
        res.setHeader('Set-Cookie', cookie.serialize('auth', jwt, {
            httpOnly : true,
            secure : process.env.NODE_ENV !== 'development',
            sameSite : 'strict',
            maxAge : 3600,
            path : '/'
        }))

        return res.status(200).json({success : "Welcome back!", userId : updateLogin.id, username : user.username});
    }else{
        return res.status(400).json({error : "The username and password entered is not matched"});
    }
}
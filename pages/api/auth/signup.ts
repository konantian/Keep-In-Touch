const bcrypt = require('bcrypt');
import { NextApiRequest, NextApiResponse } from 'next';
import { check_username, check_email } from '../../../utils/authUtil';
import prisma from '../../../lib/prisma';
import { DEFAULT_AVATAR } from './avatar';

export default async function signup(req : NextApiRequest, res : NextApiResponse ){

    if(req.method !== 'POST'){
        return res.status(405).json({error : "Method not allowed, please use POST"});
    }

    const {username, email, name,  password, avatar} = req.body;

    const validUsername = await check_username(prisma, username)
    if(!validUsername){
        return res.status(400).json({error : "This username has been occupied, please select another username"});
    }

    const validEmail = await check_email(prisma, email)
    if(!validEmail){
        return res.status(400).json({error : "This email has been occupied, please use another email"});
    }

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    const addUser = await prisma.user.create({
        data: {
            username : username,
            password : hash,
            name : name,
            email : email,
            avatar : avatar || DEFAULT_AVATAR
        }
    });

    if(!addUser){
        return res.status(400).json({error : "User register failed, please check your data"});
    }
    return res.status(201).json({success : "You are ready to log in"});
}

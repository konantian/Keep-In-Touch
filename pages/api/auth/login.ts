const bcrypt = require('bcrypt');
import { NextApiRequest, NextApiResponse } from 'next';
import { check_username, get_password } from '../../../utils/authUtil';
import prisma from '../../../lib/prisma';
import { currentTime } from '../../../utils/currentTime';

export default async function login(req : NextApiRequest, res : NextApiResponse){

    if(req.method !== 'POST'){
        return res.status(405).json({error : "Method not allowed, please use POST"});
    }

    const {username, password } = req.body;

    const newUsername = await check_username(prisma, username)
    if(newUsername){
        await prisma.$disconnect();
        return res.status(400).json({error : "The username entered does not exist, please input again"});   
    }

    const hash = await get_password(prisma, username);

    if(bcrypt.compareSync(password, hash)){

        const updateLogin = await prisma.user.update({
            where : {username : username},
            data : {lastLogin : currentTime}
        });
        await prisma.$disconnect();
        return res.status(200).json({success : "Welcome back!"});
    }else{
        await prisma.$disconnect();
        return res.status(400).json({error : "The username and password entered is not matched"});
    }
}
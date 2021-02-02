//check if given username is existed or not
export const check_username = async (prisma, username) => {
    const result = await prisma.user.findFirst({
        where : {username : username}
    });

    return result === null;
}

//check if given email is existed or not
export const check_email = async (prisma, email) => {
    const result = await prisma.user.findFirst({
        where : {email : email}
    });

    return result === null;
}

//get user's profile by its email
export const get_user_by_email = async (prisma, email) => {
    const result = await prisma.user.findFirst({
        where : {email : email},
    });

    return result;
}
export const check_username = async (prisma, username) => {
    const result = await prisma.user.findFirst({
        where : {username : username}
    });

    return result === null;
}

export const check_email = async (prisma, email) => {
    const result = await prisma.user.findFirst({
        where : {email : email}
    });

    return result === null;
}

export const get_user_by_email = async (prisma, email) => {
    const result = await prisma.user.findFirst({
        where : {email : email},
    });

    return result;
}
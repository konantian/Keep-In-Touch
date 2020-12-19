export const get_user_by_username = async (prisma, username) => {

    const user = await prisma.user.findFirst({
        where : {username : username}
    });

    return user;
}

export const get_user_by_id = async (prisma, id) => {

    const user = await prisma.user.findFirst({
        where : {id : id}
    });

    return user;
}

export const get_users = async (prisma) => {

    const users = await prisma.user.findMany();

    return users;
}
export const get_user_by_username = async (prisma, username) => {

    const user = await prisma.user.findFirst({
        where : {username : username},
        include : {posts : true, followers : true, following : true}
    });

    delete user.password;

    return user;
}

export const get_user_by_id = async (prisma, id) => {

    const user = await prisma.user.findFirst({
        where : {id : id},
        include : {posts : true, followers : true, following : true}
    });

    delete user.password;

    return user;
}

export const get_users = async (prisma) => {

    const users = await prisma.user.findMany({
        select : {
            id : true,
            bio : true,
            name : true,
            email : true,
            lastLogin : true,
            isAdmin : true
        }
    });

    return users;
}
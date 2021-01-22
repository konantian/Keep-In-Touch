import { get_visible_posts_by_user } from './postUtil';

export const get_profile_by_username = async (prisma, data) => {

    const { username, currentUser } = data;

    const user = await prisma.user.findFirst({
        where : {username : username},
        include : {posts : {
                where : {visibility : {not : 'PRIVATE'}},
                include : {comments : true, author : true, tags : true, likes : true, images : true}
            }, 
            followers : true, following : true}
    });

    delete user.password;

    user.followers = user.followers.length;
    user.following = user.following.length;

    const visiblePosts = await get_visible_posts_by_user(prisma, currentUser);

    const posts = visiblePosts.filter(post => post.author.username === username);

    user.posts = posts;

    return user;
}

export const get_users = async (prisma) => {

    const result = await prisma.user.findMany({
        select : {username : true}
    });

    const users = result.map(user => user.username);

    return users;
}

export const update_profile = async (prisma, username, data) => {
    const result = await prisma.user.update({
        where : {username: username},
        data : data
    });
    return result;
}
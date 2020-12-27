export const get_user_by_username = async (prisma, username) => {

    const user = await prisma.user.findFirst({
        where : {username : username},
        include : {posts : {include : {comments : true, author : true, tags : true}}, followers : true, following : true}
    });

    delete user.password;
    user.posts  = user.posts.map(post => {
        post.comments = post.comments.length;
        post.tags = post.tags.map(tag => tag.name);
        return post;
    })
    user.followers = user.followers.length;
    user.following = user.following.length;

    return user;
}

export const get_users = async (prisma) => {

    const result = await prisma.user.findMany({
        select : {username : true}
    });

    const users = result.map(user => user.username);

    return users;
}
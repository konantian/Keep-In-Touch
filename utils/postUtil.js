export const get_posts = async (prisma) => {

    const posts = await prisma.post.findMany();

    return posts;
}

export const get_post_by_id = async (prisma, id) => {

    const post = await prisma.post.findFirst({
        where : {id : parseInt(id)}
    });

    return post;
}

export const get_posts_by_user = async (prisma, username) => {

    const posts = await prisma.post.findMany({
        where : {author : {username : username}}
    });

    return posts;
}
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
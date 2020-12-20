export const get_posts = async (prisma) => {

    const result = await prisma.post.findMany({
        include : {comments : true, tags : true}
    });

    const posts = result.map(post => {
        post.tags = post.tags.map(tag => tag.name);
        return post;
    })

    return posts;
}

export const get_post_by_id = async (prisma, id) => {

    const post = await prisma.post.findFirst({
        where : {id : parseInt(id)},
        include : {comments : true, tags : true}
    });

    post.tags = post.tags.map(item => item.name);

    return post;
}

export const get_posts_by_user = async (prisma, username) => {

    const result = await prisma.post.findMany({
        where : {author : {username : username}},
        include : {comments : true, tags : true}
    });

    const posts = result.map(post => {
        post.tags = post.tags.map(tag => tag.name);
        return post;
    })

    return posts;
}
export const get_tags_by_post = async (prisma, id) => {

    const result = await prisma.post.findFirst({
        where : {id : parseInt(id)},
        include : {tags : true},
    });

    const tags = result.tags;
    return tags.map(item => item.name);
}

export const get_tags = async (prisma) => {

    const tags = await prisma.tag.findMany();

    return tags.map(item => item.name);
}

export const get_posts_by_tag = async (prisma, tag) => {

    const result = await prisma.tag.findMany({
        where : {name : tag},
        include : {post : {
            include : {tags : true, author : true, comments : true}
        }}
    });

    const allPosts = result.map(tag => tag.post);

    const posts = allPosts.map(post => {
        post.tags = post.tags.map(tag => tag.name);
        post.comments = post.comments.length;
        return post;
    })

    return posts;
}
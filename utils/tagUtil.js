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

    const result = await prisma.tag.findFirst({
        where : {name : tag},
        include : {posts : {
            include : {tags : true}
        }}
    });

    const allPosts = result.posts;

    const posts = allPosts.map(post => {
        post.tags = post.tags.map(tag => tag.name);
        return post;
    })

    return posts;
}
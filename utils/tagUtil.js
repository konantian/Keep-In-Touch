import { get_visible_posts_by_user } from  './postUtil';

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

export const get_posts_by_tag = async (prisma, data) => {

    const { tag, currentUser } = data;

    const visiblePosts = await get_visible_posts_by_user(prisma, currentUser);

    const tagPosts = visiblePosts.filter(post => post.tags.includes(tag));

    return tagPosts;
}
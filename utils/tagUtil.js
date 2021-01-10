import { get_visible_posts_by_user } from  './postUtil';

export const get_tags = async (prisma) => {

    const result = await prisma.tag.findMany();

    const tags = result.map(item => item.name);
    const uniqueTags = tags.filter((tag, idx) => tags.indexOf(tag) === idx);

    return uniqueTags;
}

export const get_posts_by_tag = async (prisma, data) => {

    const { tag, currentUser } = data;

    const visiblePosts = await get_visible_posts_by_user(prisma, currentUser);

    const tagPosts = visiblePosts.filter(post => post.tags.includes(tag));

    return tagPosts;
}
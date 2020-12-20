export const get_tags_by_post = async (prisma, id) => {



    const result = await prisma.post.findFirst({
        include : {tags : true},
    });

    const tags = result.tags;
    return tags.map(item => item.name);
}
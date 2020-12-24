export const get_comments = async (prisma) => {

    const comments = await prisma.comment.findMany();

    return comments;
}

export const get_comment_by_id = async (prisma, id) => {

    const comment = await prisma.comment.findFirst({
        where : {id : parseInt(id)}
    });

    return comment;
}

export const get_comments_by_post = async (prisma, id) => {

    const comments = await prisma.comment.findMany({
        where : {post : {id : parseInt(id)}},
        include : {author : true}
    });

    return comments;
}
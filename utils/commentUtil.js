export const get_comments = async (prisma) => {

    const comments = await prisma.comment.findMany();

    return comments;
}

export const get_comment_by_id = async (prisma, id) => {

    const comment = await prisma.comment.findFirst({
        where : {id : id}
    });

    return comment;
}
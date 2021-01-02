
export const addLike = async (prisma, data) => {

    const { userId, postId } = data;

    const result = await prisma.like.create({
        data : {
            author : {connect : {id : userId}},
            post : {connect : {id : postId}}
        }
    });

    return result;
}

export const unLike = async (prisma, data) => {

    const { userId, postId } = data;

    const result = await prisma.like.delete({
        where : {postId_authorId : {
                postId : postId,
                authorId : userId,
        }}
    });

    return result;

}

export const update_like = async (prisma, data) => {

    const { userId, postId } = data;

    const liked = await prisma.like.findFirst({
        where : {postId : postId, authorId : userId}
    });

    if(liked){
        const result = await unLike(prisma, data);
        return result;
    }else{
        const result = await addLike(prisma, data);
        return result
    } 

}
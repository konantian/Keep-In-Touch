//add a like to a post
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

//remove a like from a post
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

//like handler function
export const update_like = async (prisma, data) => {

    const { userId, postId } = data;

    const liked = await prisma.like.findFirst({
        where : {postId : postId, authorId : userId}
    });

    if(liked){
        //if the given post has been liked by the given user, remove this like
        const result = await unLike(prisma, data);
        return result;
    }else{
        //if the given post has not been liked by the given user, add a like
        const result = await addLike(prisma, data);
        return result
    } 

}
import { currentTime } from './currentTime';

//create a new comment based on given data
export const create_comment = async (prisma, data) => {
    const { content, username, postId } = data;

    const result = await prisma.comment.create({
        data : { 
            content : content,
            createdAt : currentTime,
            post : {connect : {id : parseInt(postId)}},
            author : {connect : {username : username}}
        }
    });

    return result;
}

//delete a comment based on given comment id
export const delete_comment = async (prisma, id) => {
    const result = await prisma.comment.delete({
        where : {id : parseInt(id)}
    });

    return result;
}

//retrieve a comment by comment id
export const get_comment_by_id = async(prisma, id) => {
    const result = await prisma.comment.findFirst({
        where : {id : parseInt(id)},
        include : {author : true}
    });

    return result;
}

//retrieve a comment by the id of the post that belongs to
export const get_comments_by_post = async (prisma, id) => {

    const comments = await prisma.comment.findMany({
        where : {post : {id : parseInt(id)}},
        include : {author : true}
    });

    return comments;
}
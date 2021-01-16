import { get_following_by_user,
         get_friends_by_user } from './followUtil';
import { currentTime } from './currentTime';

export const create_post = async (prisma, data) => {

    const { title, contentType, content, visibility, tags, images, username } = data;

    const result = await prisma.post.create({
        data : {
            title : title,
            contentType : contentType,
            content : content,
            visibility : visibility,
            createdAt : currentTime,
            updatedAt : currentTime,
            tags: {create: tags},
            images : {create: images},
            author : {connect : {username : username}}
        }
    });

    return result;
}

export const update_post = async (prisma, id, data) => {
    const result = await prisma.post.update({
        where : {id : parseInt(id)},
        data : data
    });

    return result;
}

export const delete_image = async (prisma, images) => {

    await Promise.all(images.map( async image => {
        await prisma.image.delete({
            where : {id : image.id}
        })
    }));
    
}

export const delete_comment = async (prisma, comments) => {

    await Promise.all(comments.map( async comment => {
        await prisma.comment.delete({
            where : {id : comment.id}
        })
    }));
    
}

export const delete_tag = async (prisma, tags) => {

    await Promise.all(tags.map( async tag => {
        await prisma.tag.delete({
            where : { name_postId : {
                    name : tag.name,
                    postId : tag.postId
            }}
        })
    }));
}

export const delete_like = async (prisma, likes) =>{

    await Promise.all(likes.map( async like => {
        await prisma.like.delete({
            where : {postId_authorId : {
                postId : like.postId,
                authorId : like.authorId,
            }}
        })
    }));
}

export const delete_post = async (prisma, id) => {

    const postId = parseInt(id);

    const post = await prisma.post.findFirst({
        where : {id : postId},
        include : {comments : true, tags : true, likes : true, images: true}
    });

    await delete_comment(prisma, post.comments);
    await delete_tag(prisma, post.tags);
    await delete_like(prisma, post.likes);
    await delete_image(prisma, post.images);

    const result = await prisma.post.delete({
        where : {id : postId}
    });

    return result;
}

export const get_post_by_id = async (prisma, id) => {

    const post = await prisma.post.findFirst({
        where : {id : parseInt(id)},
        include : {comments : true, tags : true, likes : true, images : true}
    });

    post.tags = post.tags.map(item => item.name);
    post.comments = post.comments.length;
    post.likes = post.likes.length;
    post.images = post.images.map(image => image.src);

    return post;
}

export const get_posts_by_user = async (prisma, username) => {

    const result = await prisma.post.findMany({
        where : {author : {username : username}},
        include : {comments : true, tags : true, likes :true, images : true}
    });

    const posts = result.map(post => {
        post.tags = post.tags.map(tag => tag.name);
        post.comments = post.comments.length;
        post.likes = post.likes.length;
        post.images = post.images.map(image => image.src);
        return post;
    });

    return posts;
}

export const if_liked = async(prisma, postId, username) => {
    const result = await prisma.like.findFirst({
        where : { postId : postId,
                  author : {username : username}}
    });

    if(result) return true;
    return false;
}

//get all visible posts by current user
export const get_visible_posts_by_user = async (prisma, username) => {

    //all public posts
    const publicPosts = await prisma.post.findMany({
        where : {author : {username : {not : username}},
                visibility : 'PUBLIC'},
        include : {comments : true, tags : true, author : true, likes : true, images: true}
    });

    //all posts that are visible to followers only
    const following = await get_following_by_user(prisma, username);
    const followerPosts = await prisma.post.findMany({
        where : {author : {username : {in : following}} ,
                visibility : "FOLLOWERS"},
        include : {comments : true, tags : true, author : true, likes : true, images: true}     
    });


    //all posts that are visible to friends only
    const friends = await get_friends_by_user(prisma, username);
    const friendPosts = await prisma.post.findMany({
        where : {author : {username : {in : friends}},
                visibility : 'FRIENDS'},
        include : {comments : true, tags : true, author : true, likes : true, images: true}   
    });

    //self posts
    const selfPosts = await prisma.post.findMany({
        where : {author : {username : username}},
        include : {comments : true, tags : true, author : true, likes : true, images: true} 
    });

    const visiblePosts = [...publicPosts, ...followerPosts, ...friendPosts, ...selfPosts];

    const posts = visiblePosts.map((post,idx) => {
        post.tags = post.tags.map(tag => tag.name);
        post.comments = post.comments.length;
        post.liked = post.likes.map(like  => like.authorId);
        post.likes = post.likes.length;
        post.images = post.images.map(image => image.src);
        return post;
    })

    return posts;
}
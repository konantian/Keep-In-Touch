import { get_following_by_user,
         get_friends_by_user } from './followUtil';

export const get_posts = async (prisma) => {

    const result = await prisma.post.findMany({
        include : {comments : true, tags : true}
    });

    const posts = result.map(post => {
        post.tags = post.tags.map(tag => tag.name);
        post.comments = post.comments.length;
        return post;
    })

    return posts;
}

export const get_post_by_id = async (prisma, id) => {

    const post = await prisma.post.findFirst({
        where : {id : parseInt(id)},
        include : {comments : true, tags : true}
    });

    post.tags = post.tags.map(item => item.name);
    post.comments = post.comments.length;

    return post;
}

export const get_posts_by_user = async (prisma, username) => {

    const result = await prisma.post.findMany({
        where : {author : {username : username}},
        include : {comments : true, tags : true}
    });

    const posts = result.map(post => {
        post.tags = post.tags.map(tag => tag.name);
        post.comments = post.comments.length;
        return post;
    });

    return posts;
}

//get all visible posts by current user
export const get_visible_posts_by_user = async (prisma, username) => {

    //all public posts
    const publicPosts = await prisma.post.findMany({
        where : {author : {username : {not : username}},
                visibility : 'PUBLIC'},
        include : {comments : true, tags : true, author : true}
    });

    //all posts that are visible to followers only
    const following = await get_following_by_user(prisma, username);
    const followerPosts = await prisma.post.findMany({
        where : {author : {id : {in : following}} ,
                visibility : "FOLLOWERS"},
        include : {comments : true, tags : true, author : true}     
    });


    //all posts that are visible to friends only
    const friends = await get_friends_by_user(prisma, username);
    const friendPosts = await prisma.post.findMany({
        where : {author : {id : {in : friends}},
                visibility : 'FRIENDS'},
        include : {comments : true, tags : true, author : true}   
    });

    //self posts
    const selfPosts = await prisma.post.findMany({
        where : {author : {username : username}},
        include : {comments : true, tags : true, author : true} 
    });

    const visiblePosts = [...publicPosts, ...followerPosts, ...friendPosts, ...selfPosts];

    const posts = visiblePosts.map(post => {
        post.tags = post.tags.map(tag => tag.name);
        post.comments = post.comments.length;
        return post;
    })

    return posts;
}
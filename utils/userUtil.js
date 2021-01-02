import { get_followers_by_user,
    get_friends_by_user } from './followUtil';

export const get_user_by_username = async (prisma, data) => {

    const { username, currentUser } = data;

    const user = await prisma.user.findFirst({
        where : {username : username},
        include : {posts : {
                where : {visibility : {not : 'PRIVATE'}},
                include : {comments : true, author : true, tags : true, likes : true}
            }, 
            followers : true, following : true}
    });

    delete user.password;
    user.posts  = user.posts.map(post => {
        post.comments = post.comments.length;
        post.tags = post.tags.map(tag => tag.name);
        post.liked = post.likes.map(like  => like.authorId);
        post.likes = post.likes.length;
        return post;
    })

    const followers = await get_followers_by_user(prisma, username);
    const friends = await get_friends_by_user(prisma, username);

    user.followers = user.followers.length;
    user.following = user.following.length;

    const publicPosts = user.posts.filter(post => post.visibility === 'PUBLIC');
    const followerPosts = user.posts.filter(post => (post.visibility === 'FOLLOWERS' && followers.includes(currentUser)));
    const friendPosts = user.posts.filter(post => (post.visibility === 'FRIENDS' && friends.includes(currentUser)));

    const allPosts =[...publicPosts,...followerPosts,...friendPosts];

    user.posts = allPosts;

    return user;
}

export const get_users = async (prisma) => {

    const result = await prisma.user.findMany({
        select : {username : true}
    });

    const users = result.map(user => user.username);

    return users;
}

export const update_bio = async( prisma, username, bio) => {
    const result = await prisma.user.update({
        where : {username: username},
        data : {bio : bio}
    });
    return result;
}
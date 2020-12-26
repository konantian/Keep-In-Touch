export const remove_follow = async (prisma, data) => {
    const {userId, followerId} = data;

    const result = await prisma.follow.delete({
        where : {followerId_userId : {
                followerId : followerId,
                userId : userId
        }}
    });

    return result;
}

export const if_follow = async (prisma, data) => {
    const {user, follower} = data;

    const ifFollow = await prisma.follow.findFirst({
        where : {
            user : {username : user}, 
            follower: {username : follower}
        }
    });

    const ifFollower = await prisma.follow.findFirst({
        where : {
            user : {username : follower}, 
            follower: {username : user}
        }
    });

    if(ifFollow && ifFollower) return 'Friend';
    else if(ifFollower) return 'Following';
    else return 'Follow';
}

export const get_followers_by_user = async (prisma, username) => {

    const followers = await prisma.follow.findMany({
        where : {user : {username : username}},
        select : {followerId : true}
    });
    
    return followers.map(item => item.followerId);
}

export const get_following_by_user = async (prisma, username) => {

    const following = await prisma.follow.findMany({
        where : {follower : {username : username}},
        select : {userId : true}
    });
    
    return following.map(item => item.userId);

}

export const get_friends_by_user = async (prisma, username) => {

    const followers = await get_followers_by_user(prisma, username);
    const following = await get_following_by_user(prisma, username);

    const friends = followers.filter(value => following.includes(value));

    return friends;
}
import { currentTime } from './currentTime';

export const add_follow = async (prisma, data) => {
    const { user, follower } = data;

    const addFollow = await prisma.follow.create({
        data : {
            user : {connect : {username : user}},
            follower : {connect : {username : follower}},
            followedAt : currentTime
        }
    });

    return addFollow;
}

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

    if(user === follower) return 'Self';

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

    const followers = await get_followers(prisma, username);
    
    return followers.map(item => item.follower.username);
}

export const get_followers = async (prisma, data) => {

    const { username, currentUser } = data;
    
    const result = await prisma.follow.findMany({
        where : {user : {username : username}},
        include : {follower : true}
    });
    const followers = await Promise.all(result.map(async (follower) => {
        const status = await if_follow(prisma,
                                      {user : currentUser,
                                       follower: follower.follower.username});
        follower.status = status;
        return follower;
    }))

    return followers;
}

export const get_following = async (prisma, data) => {

    const { username, currentUser } = data;

    const result = await prisma.follow.findMany({
        where : {follower : {username : username}},
        include : {user : true}
    });
    if(username === currentUser){
        const following = result.map(follow => {
            follow.status = 'Following';
            return follow;
        })

        return following;
    }else{
        const following = await Promise.all(result.map(async (follow) => {
            const status = await if_follow(prisma, 
                                        {user : currentUser, 
                                        follower: follow.user.username });
            follow.status = status;
            return follow;               
        }));

        return following;
    }

}

export const get_following_by_user = async (prisma, username) => {

    const following = await get_following(prisma, username);
    
    return following.map(item => item.user.username);

}

export const get_friends_by_user = async (prisma, username) => {

    const followers = await get_followers_by_user(prisma, username);
    const following = await get_following_by_user(prisma, username);

    const friends = followers.filter(value => following.includes(value));

    return friends;
}
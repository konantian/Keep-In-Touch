export const remove_follow = async (prisma, data) => {
    const {userId, followerId} = data;

    const result = await prisma.follow.delete({
        where : {userId : userId, followerId: followerId}
    });

    return result;
}

export const if_follow = async (prisma, data) => {
    const {userId, followerId} = data;

    const follow = await prisma.follow.findFirst({
        where : {userId : userId, followerId: followerId}
    });

    const follower = await prisma.follow.findFirst({
        where : {userId : followerId, followerId: userId}
    });

    if(follow && follower) return 'friend';
    else if(follower) return 'follow';
    else if(!follow && !follower) return 'none';
}
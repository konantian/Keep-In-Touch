export const LOGIN_API = '/api/auth/login';
export const SIGNUP_API = '/api/auth/signup';
export const FOLLOW_API = '/api/follow/addFollow';
export const UNFOLLOW_API = '/api/follow/unFollow';
export const IF_FOLLOW_API = '/api/follow/ifFollow';
export const USERS_API = '/api/users';
export const POSTS_API = '/api/posts';
export const COMMENTS_API = '/api/comments';
export const TAGS_API = '/api/tags';
export const COMMENT_BY_ID = (id : number) =>`/api/comment/${id}`;
export const POST_BY_ID = (id : number) =>`/api/post/${id}`;
export const TAGS_BY_POST = (id : number) =>`/api/post/${id}/tags`;
export const POSTS_BY_TAG = (tag : string) =>`/api/tag/${tag}/posts`;
export const COMMENTS_BY_POST = (id : number) =>`/api/post/${id}/comments`;
export const USER_BY_USERNAME = (username : string) => `/api/user/${username}`;
export const USER_POSTS_API = (username : string) =>`/api/user/${username}/posts`;
export const VISIBLE_POSTS_API = (username : string) =>`/api/user/${username}/visiblePosts`;
export const USER_FOLLOW_API = (username : string) =>`/api/user/${username}/follow`;


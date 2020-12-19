export const USERS_API = '/api/users';
export const POSTS_API = '/api/posts';
export const COMMENTS_API = '/api/comments';
export const COMMENT_BY_ID = (id : number) =>`/api/comment/${id}`;
export const POST_BY_ID = (id : number) =>`/api/post/${id}`;
export const USER_BY_USERNAME = (username : string) => `/api/user/${username}`;

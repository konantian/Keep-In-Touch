export const login = () => {
    return {
        type : "LOGIN"
    }
}

export const setUsername = (username : string) => {
    return {
        type : "USERNAME",
        payload: username
    }
}

export const setUserId = (userId : number) => {
    return {
        type : "USER_ID",
        payload: userId
    }
}

export const logout = () => {
    return {
        type : "LOGOUT"
    }
}
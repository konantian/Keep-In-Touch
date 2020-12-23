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

export const logout = () => {
    return {
        type : "LOGOUT"
    }
}
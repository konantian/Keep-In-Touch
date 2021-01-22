/// <reference types="next" />
/// <reference types="next/types/global" />
declare global {
    interface Decoded {
        sub : number;
        email: string;
        username: string;
        iat : number;
        exp : number;
    }
}
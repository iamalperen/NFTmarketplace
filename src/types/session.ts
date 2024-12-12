export enum SessionStatus {
    LOADING = "loading",
    AUTHENTICATED = "authenticated",
    UNAUTHENTICATED = "unauthenticated",
}

export type Profile = {
    email: string;
    name: string;
    sub?: string;
    picture?: string;
};

export type User = {
    id: string;
    email: string;
    name: string;
    username: string;
    image: string;
    role: string;
    solanaWallet: string;
}

export type Token = {
    id?: string;
    email?: string;
    name?: string;
    username?: string;
    image?: string;
    role?: string;
    solanaWallet?: string;
};


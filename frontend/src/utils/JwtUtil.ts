const decodeJwt = (token: string) => {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(c => {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}

export const getTokenFromUrl = (): string => {
    const token = new URL(window.location.href).searchParams.get("token");

    if (!token) {
        throw new Error("No token provided");
    }

    return token;
}

export const getPlayerUsername = () => {
    return decodeJwt(getTokenFromUrl()).username;
}
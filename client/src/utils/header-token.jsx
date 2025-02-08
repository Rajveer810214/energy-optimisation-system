const config = (() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    const token = storedUser?.accessToken;
    console.log(token+"hi")
    return {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    }
})();

export default config;


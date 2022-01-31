const callApi = async (url: string) => {
    try {
        const response = await fetch(url);

        if (response.ok) {
            return await response.json();
        }
        return { error: response.status }
    } catch (error) {
        return { error }
    }
}

export default callApi
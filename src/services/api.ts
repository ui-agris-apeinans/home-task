const callApi = async (url: string) => {
    try {
        const response = await fetch(url);
        console.log('resp', response)
        if (response.ok) {
            return await response.json();
        }
        return { error: response.status }
    } catch (error) {
        return { error }
    }
}

export default callApi
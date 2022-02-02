export const defaultError = { error: 'Unexpected error occurred' }

export const callApi = async (url: string) => {
    try {
        const response = await fetch(url);

        if (response.ok) {
            return await response.json();
        }
        return defaultError
    } catch (error) {
        return defaultError
    }
}

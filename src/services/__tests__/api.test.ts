import { callApi, defaultError } from '../api';

beforeEach(() => {
    fetchMock.resetMocks();
});

const mockUrl = 'api';
const mockPosts = [{
    id: 1,
    title: 'title',
    userId: '2',
    body: 'body',
}];

test('callApi should call passed url and return posts array', async () => {
    fetchMock.mockResponseOnce(JSON.stringify(mockPosts));
    const response = await callApi(mockUrl);

    expect(fetchMock).toHaveBeenCalledWith(mockUrl);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(response).toEqual(mockPosts);
});

test('callApi should return defaultError on api failure', async () => {
    fetchMock.mockReject();
    const response = await callApi(mockUrl);

    expect(response).toEqual(defaultError);
});
import { render, screen, cleanup, waitFor } from '@testing-library/react';

import Posts from '../';
import { mockPosts, mockDataGridPosts } from '../../../__mocks__/posts';
jest.mock('../../../services/api');
import { callApi } from '../../../services/api';

afterEach(cleanup)

describe('Posts', () => {
    callApi.mockReturnValue(Promise.resolve(mockPosts))

    test('renders', () => {
        render(<Posts />);

        const postsElement = screen.getByTestId('posts');
        expect(postsElement).toBeInTheDocument();
    });

    test('calls api and renders posts table', async () => {
        render(<Posts />);
        const postsElement = screen.getByTestId('posts');

        // initially shows loading animation
        expect(postsElement.getElementsByClassName('MuiCircularProgress-svg').length).toBe(1);

        // renders posts
        const tableItemTitleElement = await waitFor(() => screen.getByText(mockDataGridPosts[0].shortTitle))
        expect(tableItemTitleElement).toBeInTheDocument()


    });

    // test if api fails and no posts text shows
    // test if renders table
    // test if selecting stuff and saving works
    // check if last saved top post text works
    // test if posts selection text works
    // test localstorage to return something on first render if saved

})
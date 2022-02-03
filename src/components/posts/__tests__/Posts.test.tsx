import { render, screen, cleanup, waitFor, fireEvent } from '@testing-library/react';
import { queryHelpers } from '@testing-library/dom';

import { mockPosts, mockDataGridPosts } from '../../../__mocks__/posts';
jest.mock('../../../services/api');
import { callApi, defaultError } from '../../../services/api';
import { failToLoadMessage } from '../constants';
import Posts from '../';

afterEach(cleanup)

const queryByRowIndex = queryHelpers.queryByAttribute.bind(
    null,
    'data-rowindex',
);

describe('Posts', () => {
    callApi.mockReturnValue(Promise.resolve(mockPosts));

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

        // selecting checkbox works and saves in localstorage
        const firstRow = queryByRowIndex(postsElement, '0');
        const checkbox = firstRow.querySelector('input[type="checkbox"]');
        expect(checkbox.checked).toEqual(false);
        fireEvent.click(checkbox);
        expect(checkbox.checked).toEqual(true);
        expect(localStorage.getItem('selectedPosts')).toEqual("[1]");

        // setting checkbox off sets removes item from localstorage
        fireEvent.click(checkbox);
        expect(checkbox.checked).toEqual(false);
        expect(localStorage.getItem('selectedPosts')).toEqual("[]");

    });

    test('calls renders failure message on failed fetch', async () => {
        callApi.mockReturnValueOnce(Promise.resolve(defaultError));
        render(<Posts />);

        const failToLoadMessageElement = await waitFor(() => screen.getByText(failToLoadMessage));
        expect(failToLoadMessageElement).toBeInTheDocument();
    });

    // check if last saved top post text works
    // test if posts selection text works
    // test localstorage to return something on first render if saved
})
import { render, screen, cleanup, waitFor, fireEvent, createEvent } from '@testing-library/react';
import { queryHelpers } from '@testing-library/dom';
import moment from 'moment-timezone';

import { mockPosts, mockDataGridPosts } from '../../../__mocks__/posts';
jest.mock('../../../services/api');
import { callApi, defaultError } from '../../../services/api';
import { failToLoadMessage, LocalStorageKeys, timeFormat } from '../constants';
import Posts from '../';

afterEach(cleanup)

const queryByRowIndex = queryHelpers.queryByAttribute.bind(
    null,
    'data-rowindex',
);

describe('Posts', () => {
    (callApi as jest.MockedFunction<typeof callApi>).mockReturnValue(Promise.resolve(mockPosts));

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

        // initial post info state
        const topPostTimeElement = screen.getByTestId('topPostTime');
        const selectedPostsElement = screen.getByTestId('selectedPosts');
        expect(topPostTimeElement).toHaveTextContent('-');
        expect(selectedPostsElement).toHaveTextContent('No posts selected');

        // selecting posts checkbox works and saves in localstorage
        const firstRow = queryByRowIndex(postsElement, '0') as HTMLElement;
        const checkbox = firstRow.querySelector('input[type="checkbox"]') as HTMLInputElement;

        expect(checkbox.checked).toEqual(false);
        fireEvent.click(checkbox);
        expect(checkbox.checked).toEqual(true);
        expect(localStorage.getItem(LocalStorageKeys.SelectedPosts)).toEqual('[1]');

        // post count shows in post info
        expect(selectedPostsElement).toHaveTextContent('All posts selected');

        // setting posts checkbox off sets removes item from localstorage
        fireEvent.click(checkbox);
        expect(checkbox.checked).toEqual(false);
        expect(localStorage.getItem(LocalStorageKeys.SelectedPosts)).toEqual('[]');

        // setting top rated post radio on sets works and saves in localstorage
        const toggleContainer = firstRow.querySelector('.MuiRadio-root') as HTMLElement;
        const toggle = firstRow.querySelector('input[type="radio"]') as HTMLInputElement;

        expect(toggleContainer.querySelector('.Mui-checked')).toEqual(null);

        const event = createEvent.click(toggle)
        fireEvent.click(toggle, event);

        expect(firstRow.getElementsByClassName('Mui-checked').length).toBe(1);
        expect(JSON.parse(localStorage.getItem(LocalStorageKeys.TopPostId) as string)).toEqual("1");
        expect(JSON.parse(localStorage.getItem(LocalStorageKeys.TopPostTime) as string).slice(0, -3)).toEqual(event.timeStamp.toString().slice(0, -3));

        // shows top rated post time in EET format
        expect(topPostTimeElement).toHaveTextContent(moment.tz(event.timeStamp, 'EET').format(timeFormat))
    });

    test('calls renders failure message on failed fetch', async () => {
        (callApi as jest.MockedFunction<typeof callApi>).mockReturnValueOnce(Promise.resolve(defaultError));
        render(<Posts />);

        const failToLoadMessageElement = await waitFor(() => screen.getByText(failToLoadMessage));
        expect(failToLoadMessageElement).toBeInTheDocument();
    });
})
import { mockPosts, mockDataGridPosts } from '../../../__mocks__/posts';
import { getDataGridPosts, getPostSelectionText } from '../utils'

test('getDataGridPosts shortens title, body and adds them as shortTitle and shortBody to posts array ', () => {
    const dataGridPosts = getDataGridPosts(mockPosts);

    expect(dataGridPosts).toEqual(mockDataGridPosts)
});

describe('getPostSelectionText', () => {

    test('returns empty string if isLoading=true or !selectedPostsLength', () => {
        expect(getPostSelectionText(true, 0, 100)).toEqual('');
        expect(getPostSelectionText(false, 0, 0)).toEqual('');
    });

    test('returns "No posts selected" if !selectedPostsLength', () => {
        expect(getPostSelectionText(false, 0, 100)).toEqual('No posts selected');
    });

    test('returns "All posts selected" if selectedPostsLength === postsLength', () => {
        expect(getPostSelectionText(false, 100, 100)).toEqual('All posts selected');
    });

    test('returns "Selected 5 posts out of 100" if 5 posts of 100 selected', () => {
        expect(getPostSelectionText(false, 5, 100)).toEqual('Selected 5 posts out of 100');
    });
})
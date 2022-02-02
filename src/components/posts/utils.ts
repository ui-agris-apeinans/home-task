import { DataGridPost, Post } from '../../types';
import { maxTextChars } from './constants';

const shortenText = (text: string) => text.length > maxTextChars ? (text.substr(0, maxTextChars) + "\u2026") : text;

export const getDataGridPosts = (posts: Post[]): DataGridPost[] => posts.map(post => ({
    ...post,
    shortTitle: shortenText(post.title),
    shortBody: shortenText(post.body),
}))

export const getPostSelectionText = (isLoading: boolean, selectedPostsLength: number, postsLength: number) => {
    if (isLoading || !postsLength) {
        return ''
    }
    if (!selectedPostsLength) {
        return 'No posts selected'
    }
    if (selectedPostsLength === postsLength) {
        return 'All posts selected'
    }

    return `Selected ${selectedPostsLength} posts out of ${postsLength}`
}

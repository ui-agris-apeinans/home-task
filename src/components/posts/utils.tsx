import {  GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { styled,  Radio } from '@mui/material';

import { DataGridPost, Post } from '../../types';
import { maxTextChars } from './constants';

const CellContainer = styled('span')`
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
`

export const getColumns = (onSelectTopPostId: (topPostId: string) => void, topPostId?: string): GridColDef[] => ([
    { field: 'id', headerName: 'Id', align: 'center', width: 50 },
    {
        field: 'shortTitle', headerName: 'Title', flex: 0.2, renderCell: (params: GridRenderCellParams) => (
            <CellContainer>
                {params.value}
            </CellContainer>
        )
    },
    {
        field: 'shortBody', headerName: 'Body', flex: 0.3, renderCell: (params: GridRenderCellParams) => (
            <CellContainer>
                {params.value}
            </CellContainer>
        ),
    },
    {
        field: 'isTopRatedPost',
        headerName: 'Top Rated Post',
        align: 'center',
        width: 130,
        renderCell: (params: GridRenderCellParams) => (
            <Radio checked={Number(topPostId) === params.id} value={params.id} onChange={(event) => {
                onSelectTopPostId(event.target.value)
            }} />
        ),
    }
])

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
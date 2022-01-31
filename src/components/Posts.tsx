import React, { useState, useEffect } from 'react';
import { styled, Typography } from '@mui/material';
import { DataGrid, GridOverlay, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';

import { postsLink } from '../constants';
import { DataGridPost, Post } from '../types';
import callApi from '../services/api';

const PostsContainer = styled('div')`
    position: relative;
    display: flex;
    flex: 1;
    flex-direction: column;
    justify-content: center;
    margin-top: 12px;
`

const CellContainer = styled('span')`
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
`

const columns: GridColDef[] = [
    { field: 'id', headerName: 'Id', width: 50 },
    {
        field: 'shortTitle', headerName: 'Title', flex: 0.3, renderCell: (params: GridRenderCellParams) => (
            <CellContainer>
                {params.value}
            </CellContainer>
        )
    },
    {
        field: 'shortBody', headerName: 'Body', flex: 0.4, renderCell: (params: GridRenderCellParams) => (
            <CellContainer>
                {params.value}
            </CellContainer>
        ),
    }
]

const maxTextChars = 120;

const shortenText = (text: string) => text.length > maxTextChars ? (text.substr(0, maxTextChars) + "\u2026") : text;

const getDataGridPosts = (posts: Post[]): DataGridPost[] => posts.map(post => ({
    ...post,
    shortTitle: shortenText(post.title),
    shortBody: shortenText(post.body),
}))

const Posts: React.FC = () => {
    const [isLoading, setIsLoading] = useState(true)
    const [posts, setPosts] = useState<DataGridPost[]>([])

    useEffect(() => {
        callApi(postsLink).then(response => {
            setTimeout(() => {
                setIsLoading(false);
                if (!response.error) {
                    setPosts(getDataGridPosts(response))
                };
            }, 450)
        })
    }, [])

    return (
        <PostsContainer>
            <DataGrid columns={columns} rows={posts} loading={isLoading} initialState={{
                sorting: {
                    sortModel: [{ field: 'shortTitle', sort: 'asc' }],
                },
            }}
                components={{
                    NoRowsOverlay: () => <GridOverlay><Typography color="red">Posts didn't load, please try again later...</Typography>
                    </GridOverlay>
                }}
            />
        </PostsContainer>
    );
}

export default Posts;

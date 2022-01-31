import React, { useState, useEffect } from 'react';
import { styled, Typography } from '@mui/material';
import { DataGrid, GridOverlay } from '@mui/x-data-grid';

import { postsLink } from '../constants';
import { Post } from '../types';
import callApi from '../services/api';

const PostsContainer = styled('div')`
    position: relative;
    display: flex;
    flex: 1;
    flex-direction: column;
    justify-content: center;
    margin-top: 12px;
`

const columns = [
    { field: 'id', headerName: 'Id' },
    { field: 'title', headerName: 'Title' },
    { field: 'body', headerName: 'Body' },
]

const Posts: React.FC = () => {
    const [isLoading, setIsLoading] = useState(true)
    const [posts, setPosts] = useState<Post[]>([])

    useEffect(() => {
        callApi(postsLink).then(response => {
            console.log('Posts response', response);
            setTimeout(() => {
                setIsLoading(false);
                if (!response.error) {
                    setPosts(response)
                };
            }, 450)
        })
    }, [])

    return (
        <PostsContainer>
            <DataGrid columns={columns} rows={posts} loading={isLoading} initialState={{
                sorting: {
                    sortModel: [{ field: 'title', sort: 'asc' }],
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

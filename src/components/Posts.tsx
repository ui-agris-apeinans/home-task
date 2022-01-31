import React, { useState, useEffect } from 'react';
import { CircularProgress, styled, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

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

const StyledCircularProgress = styled(CircularProgress)`
    position: absolute;
    right: 0;
    left: 0;
    margin: auto;
`

const columns = [
    { field: 'id', headerName: 'Id' },
    { field: 'title', headerName: 'Title' },
    { field: 'body', headerName: 'Body' },
]

const Posts: React.FC = () => {
    const [loaded, setIsLoaded] = useState(false)
    const [posts, setPosts] = useState<Post[]>([])

    useEffect(() => {
        callApi(postsLink).then(response => {
            console.log('Posts response', response);
            setTimeout(() => {
                setIsLoaded(true);
                if (!response.error) {
                    setPosts(response)
                };
            }, 450)
        })
    }, [])

    return (
        <PostsContainer>
            {loaded ? <>
                {posts.length ? <DataGrid columns={columns} rows={posts} /> : <Typography color="red">Posts didn't load, please try again later...</Typography>}</> : <StyledCircularProgress />}
        </PostsContainer>
    );
}

export default Posts;

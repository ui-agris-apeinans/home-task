import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { styled, Typography, Radio } from '@mui/material';
import { DataGrid, GridOverlay, GridColDef, GridRenderCellParams, GridRowId } from '@mui/x-data-grid';
import moment from 'moment-timezone';

import { postsLink } from '../constants';
import { DataGridPost, Post } from '../types';
import { callApi, useLocalStorage } from '../services';

const PostsContainer = styled('div')`
    position: relative;
    display: flex;
    flex: 1;
    flex-direction: column;
    justify-content: center;
    margin: 12px 0 18px 0;
`

const StyledDataGrid = styled(DataGrid)`
    background: #deeefcc4;
`

const CellContainer = styled('span')`
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
`

const InfoContainer = styled('div')`
    display: flex;
    justify-content: space-between;
    margin-bottom: 12px;
`

const getColumns = (onSelectTopPostId: (topPostId: string) => void, topPostId?: string): GridColDef[] => ([
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

const maxTextChars = 120;

const shortenText = (text: string) => text.length > maxTextChars ? (text.substr(0, maxTextChars) + "\u2026") : text;

const getDataGridPosts = (posts: Post[]): DataGridPost[] => posts.map(post => ({
    ...post,
    shortTitle: shortenText(post.title),
    shortBody: shortenText(post.body),
}))

const Posts: React.FC = () => {
    const [topPostId, setTopPostId] = useLocalStorage('topPostId', '');
    const [topPostTime, setTopPostTime] = useLocalStorage('topPostTime', '');
    const [selectedPosts, setSelectedPosts] = useLocalStorage<GridRowId[]>('selectedPosts', []);

    const [isLoading, setIsLoading] = useState(true);
    const [posts, setPosts] = useState<DataGridPost[]>([]);

    useEffect(() => {
        callApi(postsLink).then(response => {
            setTimeout(() => {
                setIsLoading(false);
                if (!response.error) {
                    setPosts(getDataGridPosts(response))
                };
            }, 450)
        })
    }, []);

    const onSelectTopPostId = useCallback((value: string) => {
        setTopPostId(value);
        setTopPostTime(new Date().getTime().toString())
    }, [])

    const columns = useMemo(() => getColumns(onSelectTopPostId, topPostId), [topPostId, onSelectTopPostId]);

    const postSelectionText = useMemo(() => {
        if (!selectedPosts.length) {
            return 'No posts selected'
        }
        if (selectedPosts.length === posts.length) {
            return 'All posts selected'
        }

        return `Selected ${selectedPosts.length} posts out of ${posts.length}`
    }, [selectedPosts.length, posts.length]);

    return (
        <PostsContainer>
            <InfoContainer>
                <Typography>
                    {!isLoading && postSelectionText}
                </Typography>
                <div>
                    <Typography>
                        Top Rated Post change time:
                    </Typography>
                    <Typography>
                        {topPostTime ? moment.tz(Number(topPostTime), 'EET').format("YYYY.MM.DD. HH:mm (z)") : '-'}
                    </Typography>
                </div>
            </InfoContainer>
            <StyledDataGrid
                columns={columns}
                rows={posts}
                loading={isLoading}
                onSelectionModelChange={(model) => {
                    !isLoading && setSelectedPosts(model)
                }}
                selectionModel={selectedPosts}
                checkboxSelection
                hideFooter
                disableSelectionOnClick
                disableColumnMenu
                initialState={{
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

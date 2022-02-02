import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { styled, Typography, Radio } from '@mui/material';
import { DataGrid, GridOverlay, GridRowId, GridRenderCellParams, GridColDef } from '@mui/x-data-grid';
import moment from 'moment-timezone';
import { useLocalStorage } from 'usehooks-ts';

import { postsLink } from '../../constants';
import { DataGridPost } from '../../types';
import { callApi } from '../../services';
import { getDataGridPosts, getPostSelectionText } from './utils';

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
    
    .MuiDataGrid-cell {
        font-size: 12px;
        white-space: normal;
    }
`

const InfoContainer = styled('div')`
    display: flex;
    justify-content: space-between;
    margin-bottom: 12px;
`

const getColumns = (onSelectTopPostId: (topPostId: string) => void, topPostId?: string): GridColDef[] => ([
    {
        field: 'id',
        headerName: 'Id',
        align: 'center',
        width: 50
    },
    {
        field: 'shortTitle',
        headerName: 'Title',
        flex: 0.2,
    },
    {
        field: 'shortBody',
        headerName: 'Body',
        flex: 0.3,
    },
    {
        field: 'isTopRatedPost',
        headerName: 'Top Rated Post',
        align: 'center',
        width: 130,
        sortable: false,
        renderCell: (params: GridRenderCellParams) => (
            <Radio checked={Number(topPostId) === params.id} value={params.id} onChange={(event) => {
                onSelectTopPostId(event.target.value)
            }} />
        ),
    }
])

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

    const postSelectionText = useMemo(() => getPostSelectionText(isLoading, selectedPosts.length, posts.length), [selectedPosts.length, posts.length, isLoading]);

    return (
        <PostsContainer>
            <InfoContainer>
                <Typography>
                    {postSelectionText}
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
                rowHeight={75}
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

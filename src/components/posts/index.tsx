import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { styled, Typography, Radio } from '@mui/material';
import { DataGrid, GridOverlay, GridRowId, GridRenderCellParams, GridColDef } from '@mui/x-data-grid';
import moment from 'moment-timezone';
import { useLocalStorage } from 'usehooks-ts';

import { postsLink, failToLoadMessage, LocalStorageKeys, timeFormat } from './constants';
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

const getColumns = (onSelectTopPostId: (topPostId: string, timeStamp: number) => void, topPostId?: string): GridColDef[] => ([
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
                onSelectTopPostId(event.target.value, event.timeStamp)
            }} />
        ),
    }
])

const Posts: React.FC = () => {
    const [topPostId, setTopPostId] = useLocalStorage(LocalStorageKeys.TopPostId, '');
    const [topPostTime, setTopPostTime] = useLocalStorage(LocalStorageKeys.TopPostTime, '');
    const [selectedPosts, setSelectedPosts] = useLocalStorage<GridRowId[]>(LocalStorageKeys.SelectedPosts, []);

    const [isLoading, setIsLoading] = useState(true);
    const [posts, setPosts] = useState<DataGridPost[]>([]);

    useEffect(() => {
        let timeout: ReturnType<typeof setTimeout>;
        callApi(postsLink).then(response => {
            timeout = setTimeout(() => {
                setIsLoading(false);
                if (!response.error) {
                    setPosts(getDataGridPosts(response))
                };
            }, 450)
        });
        return () => {
            timeout && clearTimeout(timeout)
        }
    }, []);

    const onSelectTopPostId = useCallback((value: string, timeStamp: number) => {
        setTopPostId(value);
        setTopPostTime(new Date(timeStamp).getTime().toString())
    }, [])

    const columns = useMemo(() => getColumns(onSelectTopPostId, topPostId), [topPostId, onSelectTopPostId]);

    const postSelectionText = useMemo(() => getPostSelectionText(isLoading, selectedPosts.length, posts.length), [selectedPosts.length, posts.length, isLoading]);

    return (
        <PostsContainer data-testid="posts">
            <InfoContainer>
                <Typography data-testid="selectedPosts">
                    {postSelectionText}
                </Typography>
                <div>
                    <Typography>
                        Top Rated Post change time:
                    </Typography>
                    <Typography data-testid="topPostTime">
                        {topPostTime ? moment.tz(Number(topPostTime), 'EET').format(timeFormat) : '-'}
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
                columnBuffer={5}
                initialState={{
                    sorting: {
                        sortModel: [{ field: 'shortTitle', sort: 'asc' }],
                    },
                }}
                components={{
                    NoRowsOverlay: () => <GridOverlay><Typography color="red">{failToLoadMessage}</Typography>
                    </GridOverlay>
                }}
            />
        </PostsContainer>
    );
}

export default Posts;

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { styled, Typography } from '@mui/material';
import { DataGrid, GridOverlay, GridRowId } from '@mui/x-data-grid';
import moment from 'moment-timezone';

import { postsLink } from '../../constants';
import { DataGridPost } from '../../types';
import { callApi, useLocalStorage } from '../../services';
import { getDataGridPosts, getColumns, getPostSelectionText } from './utils';

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

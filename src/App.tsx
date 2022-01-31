import React from 'react';
import { Typography, Container, styled } from '@mui/material';

import Posts from './components/Posts'

const StyledContainer = styled(Container)`
  background-color: #dff0dc;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`

const App: React.FC = () => (
  <StyledContainer>
    <Typography variant="h4" align="center" paddingTop="12px">Posts</Typography>
    <Posts />
  </StyledContainer>
)

export default App;

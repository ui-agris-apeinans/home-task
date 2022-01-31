import React, { useState, useEffect } from 'react';
import { Typography, Container } from '@mui/material';

import './App.css';
import { postsLink } from './constants';
import callApi from './services/api';

function App() {
  useEffect(() => {
    callApi(postsLink).then(res => {
      console.log(res)

    })
  }, [])
  return (
    <div className="App">
      <Container>
        <Typography variant="h4" align="center" paddingTop="12px">Posts</Typography>
      </Container>
    </div>
  );
}

export default App;

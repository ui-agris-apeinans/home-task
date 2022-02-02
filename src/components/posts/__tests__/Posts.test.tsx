import React from 'react';
import { render, screen } from '@testing-library/react';

import Posts from '../';

describe('Posts component', () => {

    test('renders', () => {
        render(<Posts />);
    });

})
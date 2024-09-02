import 'react-native';
import React from 'react';
import App from '../App';

import {render, screen} from '@testing-library/react-native';

it('should render the App', () => {
  render(<App />);

  expect(screen.getByText('Loading...')).toBeTruthy();
});

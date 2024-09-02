import React from 'react';
import {
  render,
  fireEvent,
  waitFor,
  screen,
} from '@testing-library/react-native';
import SearchComponent from './../SearchComponent';
import getWeatherImage from './../helpers/getWeatherImage';

jest.mock('./../helpers/getWeatherImage', () => ({
  __esModule: true,
  default: (weatherCode: number) =>
    `http://openweathermap.org/img/wn/${weatherCode}d@2x.png`,
}));

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () =>
      Promise.resolve({
        results: [
          {
            id: 1,
            name: 'Mumbai',
            latitude: 19.07283,
            longitude: 72.88261,
            elevation: 8,
            feature_code: 'PPLA',
            country_code: 'IN',
            admin1_id: 1264418,
            timezone: 'Asia/Kolkata',
            population: 12691836,
            country_id: 1269750,
            country: 'India',
            admin1: 'Maharashtra',
          },
        ],
        daily: {
          temperature_2m_max: [30, 32, 31],
          temperature_2m_min: [25, 26, 24],
        },
        current_weather: {
          weathercode: 3,
        },
      }),
  }),
) as jest.Mock;

describe('SearchComponent Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders correctly', () => {
    render(<SearchComponent />);
    expect(screen.getByPlaceholderText('Search...')).toBeTruthy();
  });

  test('fetches data and updates state on input change', async () => {
    render(<SearchComponent />);

    fireEvent.changeText(screen.getByPlaceholderText('Search...'), 'Mumbai');

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(1);
      expect(global.fetch).toHaveBeenCalledWith(
        'https://geocoding-api.open-meteo.com/v1/search?name=Mumbai',
      );
    });
  });

  test('debounces the search input', async () => {
    jest.useFakeTimers();
    render(<SearchComponent />);

    fireEvent.changeText(screen.getByPlaceholderText('Search...'), 'Mumbai');
    fireEvent.changeText(
      screen.getByPlaceholderText('Search...'),
      'Mumbai India',
    );

    jest.advanceTimersByTime(500);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(1);
      expect(global.fetch).toHaveBeenCalledWith(
        'https://geocoding-api.open-meteo.com/v1/search?name=Mumbai India',
      );
    });

    jest.useRealTimers();
  });
});

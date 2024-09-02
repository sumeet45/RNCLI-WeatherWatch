import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import WeatherComponent from './src/weather';
import {WeatherCode} from './src/helpers/getWeatherImage';

export interface TempData {
  temperature: number; // Assuming temperature is a number
  weatherCode: WeatherCode | number; // Assuming weather code is a number
  loading: boolean;
}

interface CurrentWeatherUnits {
  time: string;
  interval: string;
  temperature: string;
  windspeed: string;
  winddirection: string;
  is_day: string;
  weathercode: string;
}

// Interface for the current weather data
interface CurrentWeather {
  time: string;
  interval: number;
  temperature: number;
  windspeed: number;
  winddirection: number;
  is_day: number;
  weathercode: number;
}

// Interface for the full weather response
interface AppResLatLong {
  latitude: number;
  longitude: number;
  generationtime_ms: number;
  utc_offset_seconds: number;
  timezone: string;
  timezone_abbreviation: string;
  elevation: number;
  current_weather_units: CurrentWeatherUnits;
  current_weather: CurrentWeather;
}

export default function App() {
  const [tempData, setTempData] = useState<TempData>({
    temperature: 0,
    weatherCode: 0,
    loading: true,
  });

  const fetchWeatherData = (lat: number, long: number, days: number) => {
    fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&current_weather=true`,
    )
      .then(res => res.json())
      .then((data: AppResLatLong) => {
        setTempData({
          temperature: data.current_weather.temperature,
          weatherCode: data.current_weather.weathercode,
          loading: false,
        });
      });
  };
  useEffect(() => {
    fetchWeatherData(18.52, 73.85, 1);
  }, []);

  return (
    <View style={styles.container}>
      {tempData.loading ? (
        <Text>Loading...</Text>
      ) : (
        <WeatherComponent tempData={tempData} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#adadca',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

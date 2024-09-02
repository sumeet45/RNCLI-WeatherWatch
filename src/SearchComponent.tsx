import React, {useState, useCallback} from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import getWeatherImage, {WeatherCode} from './helpers/getWeatherImage';
import CityComponent from './CityComponent';

export interface City {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  elevation: number;
  feature_code: string;
  country_code: string;
  admin1_id: number;
  timezone: string;
  population: number;
  country_id: number;
  country: string;
  admin1: string;
}
interface Cities {
  cities: City[];
  selectedCity: City[];
  avgData: [number, WeatherCode][];
}

const SearchComponent = () => {
  const [query, setQuery] = useState<string>('');
  const [cities, setCities] = useState<Cities>({
    cities: [],
    selectedCity: [],
    avgData: [],
  });

  const debounce = (func: (arg: string) => void, delay: number) => {
    let debounceTimer: NodeJS.Timeout | undefined;
    return function (this: unknown, ...args: [string]) {
      if (debounceTimer) clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => func(...args), delay);
    };
  };

  const handleSearch = (searchStr: string) => {
    fetchLatLong(searchStr);
  };

  const debouncedSearch = useCallback(debounce(handleSearch, 500), []);

  const handleChange = (text: string) => {
    if (text !== '') {
      setQuery(text);
      debouncedSearch(text);
    } else {
      setQuery(text);
      setCities({cities: [], selectedCity: [], avgData: []});
    }
  };

  const fetchLatLong = (str: string) => {
    fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${str}`)
      .then(res => res.json())
      .then(data => {
        setCities({cities: data.results, selectedCity: [], avgData: []});
      });
  };

  const fetchDataBasedOnGiven = (city: City) => {
    fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${city.latitude}&longitude=${city.longitude}&daily=temperature_2m_max,temperature_2m_min&timezone=auto&current_weather=true`,
    )
      .then(res => res.json())
      .then(data => {
        var avgData = [];
        for (let i = 0; i < data.daily.temperature_2m_max.length; i++) {
          let avg =
            (data.daily.temperature_2m_max[i] +
              data.daily.temperature_2m_min[i]) /
            2;

          avgData.push([Math.round(avg), data.current_weather.weathercode]);
        }
        setCities({cities: [], selectedCity: [{...city}], avgData: avgData});
      });
  };

  const renderWeeklyData = () => {
    const content = cities.avgData.map((value, index) => {
      let url = getWeatherImage(value[1]);
      return (
        <Text key={index} style={{marginVertical: 10}}>
          Day {index}: {value[0]} C{' '}
          <Image source={{uri: url}} style={{width: 30, height: 30}} />
        </Text>
      );
    });
    return content;
  };
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Search..."
        value={query}
        onChangeText={handleChange}
      />

      <CityComponent
        cities={cities.cities}
        fetchDataBasedOnGiven={fetchDataBasedOnGiven}
      />
      {cities.avgData.length !== 0 ? (
        <Text style={{fontSize: 16, fontWeight: 'bold', marginTop: 10}}>
          Selected City: {cities.selectedCity[0].name}, Country :{' '}
          {cities.selectedCity[0].country}
        </Text>
      ) : null}
      {cities.avgData.length !== 0 ? renderWeeklyData() : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  resultsContainer: {
    marginTop: 20,
  },
  resultItem: {
    padding: 10,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
  },
});

export default SearchComponent;

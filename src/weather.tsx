import {useEffect, useState} from 'react';
import {Image, Text, TextInput, View} from 'react-native';
import getWeatherImage from './helpers/getWeatherImage';
import SearchComponent from './SearchComponent';
import {TempData} from '../App';

interface WeatherComponentProps {
  tempData: TempData;
}

const WeatherComponent: React.FC<WeatherComponentProps> = props => {
  const imageUrl = getWeatherImage(props.tempData.weatherCode);

  return (
    <View>
      <View>
        <Text></Text>
        <Text style={{fontSize: 16, fontWeight: 'bold'}}>
          Pune's Current Temperature : {props.tempData.temperature} C
          <Image source={{uri: imageUrl}} style={{width: 100, height: 100}} />
        </Text>
      </View>
      <View>
        <SearchComponent />
      </View>
    </View>
  );
};

export default WeatherComponent;

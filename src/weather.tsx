import {useEffect, useState} from 'react';
import {Image, StyleSheet, Text, TextInput, View} from 'react-native';
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
        <Text style={styles.headline}>
          Pune's Current Temperature : {props.tempData.temperature} C
          <Image source={{uri: imageUrl}} style={styles.img} />
        </Text>
      </View>
      <View>
        <SearchComponent />
      </View>
    </View>
  );
};

export default WeatherComponent;

const styles = StyleSheet.create({
  headline: {fontSize: 16, fontWeight: 'bold'},
  img: {width: 100, height: 100},
});

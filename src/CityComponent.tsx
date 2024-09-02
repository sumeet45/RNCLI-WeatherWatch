import {FlatList, Text, TouchableOpacity, View} from 'react-native';
import {City} from './SearchComponent';

interface CityComponentProps {
  cities: City[];
  fetchDataBasedOnGiven(city: City): void;
}

const CityComponent: React.FC<CityComponentProps> = props => {
  const renderHandler = ({item, index}: {item: City; index: number}) => {
    return (
      <View key={index} style={{marginVertical: 15}}>
        <TouchableOpacity onPress={() => props.fetchDataBasedOnGiven(item)}>
          <Text>
            {item.name} - {item.country}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };
  const renderCities = () => {
    if (props.cities.length !== 0) {
      return (
        <FlatList data={props.cities} renderItem={renderHandler}></FlatList>
      );
    } else {
      return null;
    }
  };

  return props.cities && props.cities?.length !== 0 ? renderCities() : null;
};

export default CityComponent;

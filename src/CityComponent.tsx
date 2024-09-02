import {Text, TouchableOpacity, View} from 'react-native';
import {City} from './SearchComponent';

interface CityComponentProps {
  cities: City[];
  fetchDataBasedOnGiven(city: City): void;
}

const CityComponent: React.FC<CityComponentProps> = props => {
  const renderCities = () => {
    if (props.cities.length !== 0) {
      return props.cities.map((obj, index) => {
        return (
          <View key={index} style={{marginVertical: 15}}>
            <TouchableOpacity onPress={() => props.fetchDataBasedOnGiven(obj)}>
              <Text>
                {obj.name} - {obj.country}
              </Text>
            </TouchableOpacity>
          </View>
        );
      });
    } else {
      return null;
    }
  };

  return props.cities && props.cities?.length !== 0 ? renderCities() : null;
};

export default CityComponent;

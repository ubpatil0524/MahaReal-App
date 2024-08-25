import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/Foundation';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';


const HomeScreen = ({ navigation }) => {
  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>

      <TouchableOpacity style={styles.container} onPress={() => navigation.navigate('Search')} >
        <View style={styles.icon}>
          <Icon name="map" size={30} color='green' />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.mainText}>Find 7/12</Text>
          <Text style={styles.subText}>Get map by survey no.</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity style={styles.container} onPress={() => navigation.navigate('UnitConverter')} >
        <View style={styles.icon}>
          <AntDesign name="swap" size={30} color='green' />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.mainText}>Unit Converter</Text>
          <Text style={styles.subText}>Convert among acre, guntha, sq.meter, hectare</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity style={styles.container} onPress={() => navigation.navigate('MeasureAreaOnMap')} >
        <View style={styles.icon}>
          <MaterialCommunityIcons name="tape-measure" size={30} color='green' />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.mainText}>Measure Area on Map</Text>
          <Text style={styles.subText}>Measure area and Length</Text>
        </View>
      </TouchableOpacity>

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    alignItems: 'center',
    paddingVertical: 20,
    backgroundColor: '#f5f5f5',
  },
  container: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 10,
    marginVertical: 10,
    flexDirection: 'row',
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  icon: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
  },
  textContainer: {
    flex: 1,
  },
  mainText: {
    fontSize: 20,
    fontWeight: '600',
    color: 'green',
  },
  subText: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  },
});

export default HomeScreen;

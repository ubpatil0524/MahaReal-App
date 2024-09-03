import React, {useState, useEffect} from 'react';
import {StyleSheet, Text, TouchableOpacity, View, Alert} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import MapView, {
  Marker,
  PROVIDER_GOOGLE,
  Polygon,
  Circle,
} from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import {polygon, area, length} from '@turf/turf';

function MeasureAreaOnMap({navigation}) {
  const [mapRegion, setMapRegion] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [polygonCoords, setPolygonCoords] = useState([]);
  const [measurements, setMeasurements] = useState({area: 0, perimeter: 0});
  const [mapType, setMapType] = useState('standard');
  const [selectedUnit, setSelectedUnit] = useState('Square m');

  const conversionFactors = {
    'Square m': 1,
    'Square mm': 1e6,
    'Square cm': 1e4,
    'Square km': 1e-6,
    'Square miles': 3.861e-7,
    'Square yards': 1.196,
  };

  useEffect(() => {
    Geolocation.getCurrentPosition(
      position => {
        const {latitude, longitude} = position.coords;
        setMapRegion({
          latitude: latitude,
          longitude: longitude,
          latitudeDelta: 0.015,
          longitudeDelta: 0.0121,
        });
        setErrorMessage(null);
      },
      error => {
        console.log(error.code, error.message);
        setErrorMessage(error.message);
        showAlert('Location Error', error.message, retryGeolocation);
      },
      {enableHighAccuracy: false, timeout: 60000, maximumAge: 60000},
    );

    const watchId = Geolocation.watchPosition(
      position => {
        const {latitude, longitude} = position.coords;
        setMapRegion(prevRegion => ({
          ...prevRegion,
          latitude: latitude,
          longitude: longitude,
        }));
        setErrorMessage(null);
      },
      error => {
        setErrorMessage(error.message);
        showAlert('Please Turn On Location', error.message, retryGeolocation);
      },
      {enableHighAccuracy: false, distanceFilter: 50},
    );

    return () => {
      if (watchId !== null) {
        Geolocation.clearWatch(watchId);
      }
    };
  }, []);

  const retryGeolocation = () => {
    Geolocation.getCurrentPosition(
      position => {
        const {latitude, longitude} = position.coords;
        setMapRegion({
          latitude: latitude,
          longitude: longitude,
          latitudeDelta: 0.0,
          longitudeDelta: 0.0,
        });
        setErrorMessage(null);
      },
      error => {
        console.log(error.code, error.message);
        setErrorMessage(error.message);
      },
      {enableHighAccuracy: false, timeout: 60000, maximumAge: 60000},
    );
  };

  const handleMapPress = e => {
    const newCoords = [...polygonCoords, e.nativeEvent.coordinate];
    if (
      newCoords.length > 2 &&
      newCoords[0].latitude === e.nativeEvent.coordinate.latitude &&
      newCoords[0].longitude === e.nativeEvent.coordinate.longitude
    ) {
      newCoords.push(newCoords[0]);
      setPolygonCoords(newCoords);
      calculateAndUpdateMeasurements(newCoords);
    } else {
      setPolygonCoords(newCoords);
      calculateAndUpdateMeasurements(newCoords);
    }
  };

  const calculateAndUpdateMeasurements = coords => {
    if (coords.length < 4) return;
    const closedCoords =
      coords.length > 3 &&
      coords[0].latitude === coords[coords.length - 1].latitude &&
      coords[0].longitude === coords[coords.length - 1].longitude
        ? coords
        : [...coords, coords[0]];

    const areaValue = calculateArea(closedCoords);
    const perimeterValue = calculatePerimeter(closedCoords);
    setMeasurements({
      area: areaValue * conversionFactors[selectedUnit],
      perimeter: perimeterValue,
    });
  };

  const calculateArea = coords => {
    if (coords.length < 4) return 0;
    const polygonGeoJson = polygon([
      coords.map(coord => [coord.longitude, coord.latitude]),
    ]);
    return area(polygonGeoJson);
  };

  const calculatePerimeter = coords => {
    if (coords.length < 4) return 0;
    const polygonGeoJson = polygon([
      coords.map(coord => [coord.longitude, coord.latitude]),
    ]);
    return length(polygonGeoJson) * 1000;
  };

  const showAlert = (title, message, retryAction) => {
    Alert.alert(
      title,
      message,
      [
        {text: 'Cancel', style: 'cancel'},
        {text: 'Retry', onPress: retryAction},
      ],
      {cancelable: false},
    );
  };

  return (
    <View style={styles.container}>
      {mapRegion ? (
        <MapView
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          region={mapRegion}
          showsUserLocation={true}
          followsUserLocation={true}
          mapType={mapType}
          onPress={handleMapPress}>
          <Marker coordinate={mapRegion} title="Your Location" />
          {polygonCoords.length > 1 && (
            <Polygon
              coordinates={polygonCoords}
              strokeColor="rgba(0, 0, 255, 0.8)"
              strokeWidth={2}
              fillColor="rgba(0, 0, 255, 0.2)"
            />
          )}
          {polygonCoords.map((coordinate, index) => (
            <Circle
              key={index}
              center={coordinate}
              radius={2}
              strokeColor="rgba(255, 0, 0, 0.8)"
              fillColor="rgba(255, 0, 0, 0.5)"
            />
          ))}
        </MapView>
      ) : (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      )}

      {errorMessage && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Error: {errorMessage}</Text>
        </View>
      )}

      <View style={styles.measurementsContainer}>
        <Text style={styles.measurementsText}>
          Area: {measurements.area.toFixed(2)} {selectedUnit}
        </Text>
        <Text style={styles.measurementsText}>
          Perimeter: {measurements.perimeter.toFixed(2)} mm
        </Text>
      </View>

      <View style={styles.dropdownContainer}>
        <Picker
          selectedValue={mapType}
          style={styles.picker}
          onValueChange={itemValue => setMapType(itemValue)}>
          <Picker.Item label="Normal" value="standard" />
          <Picker.Item label="Satellite" value="satellite" />
          <Picker.Item label="Hybrid" value="hybrid" />
        </Picker>

        <Picker
          selectedValue={selectedUnit}
          style={styles.picker}
          onValueChange={itemValue => setSelectedUnit(itemValue)}>
          <Picker.Item label="Square m" value="Square m" />
          <Picker.Item label="Square mm" value="Square mm" />
          <Picker.Item label="Square cm" value="Square cm" />
          <Picker.Item label="Square km" value="Square km" />
          <Picker.Item label="Square miles" value="Square miles" />
          <Picker.Item label="Square yards" value="Square yards" />
        </Picker>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    height: '100%',
    width: '100%',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 18,
  },
  errorContainer: {
    position: 'absolute',
    top: 10,
    left: 10,
    right: 10,
    backgroundColor: 'rgba(255, 0, 0, 0.8)',
    padding: 10,
    borderRadius: 5,
  },
  errorText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  measurementsContainer: {
    position: 'absolute',
    bottom: 20,
    width: '95%',
    alignSelf: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    elevation: 2,
  },
  measurementsText: {
    fontSize: 16,
    color: 'black',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  dropdownContainer: {
    position: 'absolute',
    top: 10,
    width: '90%',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    elevation: 2,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignSelf: 'center',
  },
  picker: {
    width: '100%',
    color: 'black',
    flex: 1,
  },
});

export default MeasureAreaOnMap;

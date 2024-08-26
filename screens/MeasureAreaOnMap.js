import React, {useState, useEffect} from 'react';
import {StyleSheet, Text, TouchableOpacity, View, Alert} from 'react-native';
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
        Alert.alert('Location Error', error.message, [
          {text: 'Try Again', onPress: () => retryGeolocation()},
        ]);
      },
      {enableHighAccuracy: true, timeout: 30000, maximumAge: 10000},
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
        Alert.alert('Please turn on location', error.message, [
          {text: 'Try Again', onPress: () => retryGeolocation()},
        ]);
      },
      {enableHighAccuracy: true, distanceFilter: 10},
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
          latitudeDelta: 0.015,
          longitudeDelta: 0.0121,
        });
        setErrorMessage(null);
      },
      error => {
        console.log(error.code, error.message);
        setErrorMessage(error.message);
      },
      {enableHighAccuracy: true, timeout: 30000, maximumAge: 10000},
    );
  };

  const handleMapPress = e => {
    const newCoords = [...polygonCoords, e.nativeEvent.coordinate];
    if (
      newCoords.length > 2 &&
      newCoords[0].latitude === e.nativeEvent.coordinate.latitude &&
      newCoords[0].longitude === e.nativeEvent.coordinate.longitude
    ) {
      // Close the polygon
      newCoords.push(newCoords[0]);
      setPolygonCoords(newCoords);
      calculateAndUpdateMeasurements(newCoords);
    } else {
      setPolygonCoords(newCoords);
      calculateAndUpdateMeasurements(newCoords);
    }
  };

  const calculateAndUpdateMeasurements = coords => {
    if (coords.length < 4) return; // Ensure minimum number of points

    // Ensure the polygon is closed
    const closedCoords =
      coords.length > 3 &&
      coords[0].latitude === coords[coords.length - 1].latitude &&
      coords[0].longitude === coords[coords.length - 1].longitude
        ? coords
        : [...coords, coords[0]];

    const areaValue = calculateArea(closedCoords);
    const perimeterValue = calculatePerimeter(closedCoords);
    setMeasurements({area: areaValue, perimeter: perimeterValue});
  };

  const calculateArea = coords => {
    if (coords.length < 4) return 0;
    const polygonGeoJson = polygon([
      coords.map(coord => [coord.longitude, coord.latitude]),
    ]);
    return area(polygonGeoJson); // Area in square meters
  };

  const calculatePerimeter = coords => {
    if (coords.length < 4) return 0;
    const polygonGeoJson = polygon([
      coords.map(coord => [coord.longitude, coord.latitude]),
    ]);
    return length(polygonGeoJson) * 1000; // Perimeter in millimeters
  };

  return (
    <View style={{flex: 1}}>
      {mapRegion ? (
        <MapView
          provider={PROVIDER_GOOGLE}
          style={{height: '100%', width: '100%'}}
          region={mapRegion}
          showsUserLocation={true}
          followsUserLocation={true}
          onPress={handleMapPress}>
          <Marker coordinate={mapRegion} title="Your Location" />
          {polygonCoords.length > 1 && (
            <Polygon
              coordinates={polygonCoords}
              strokeColor="blue"
              strokeWidth={2}
              fillColor="rgba(0, 0, 255, 0.1)"
            />
          )}
          {polygonCoords.map((coordinate, index) => (
            <Circle
              key={index}
              center={coordinate}
              radius={2} // Radius of the circle in meters
              strokeColor="red"
              fillColor="rgba(255, 0, 0, 0.5)"
            />
          ))}
        </MapView>
      ) : (
        <Text
          style={{
            color: 'black',
            fontWeight: 'bold',
            alignSelf: 'center',
            textAlign: 'center',
          }}>
          Loading...
        </Text>
      )}

      {errorMessage && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Error: {errorMessage}</Text>
        </View>
      )}

      {/* <TouchableOpacity style={styles.retryButton} onPress={retryGeolocation}>
        <Text style={styles.retryButtonText}>LIVE</Text>
      </TouchableOpacity> */}

      <View style={styles.measurementsContainer}>
        <Text style={styles.measurementsText}>
          Area: {measurements.area.toFixed(2)} sq mtr
        </Text>
        <Text style={styles.measurementsText}>
          Perimeter: {measurements.perimeter.toFixed(2)} mm
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  errorContainer: {
    position: 'absolute',
    top: 10,
    left: 10,
    right: 10,
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
  },
  errorText: {
    color: 'white',
  },
  retryButton: {
    position: 'absolute',
    bottom: 20,
    left: '5%',
    right: '5%',
    backgroundColor: 'red',
    padding: 10,
    alignItems: 'center',
    borderRadius: 5,
  },
  retryButtonText: {
    color: 'white',
  },
  measurementsContainer: {
    position: 'absolute',
    bottom: 20,
    width: '95%',
    alignSelf: 'center',
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: 'gray',
  },
  measurementsText: {
    fontSize: 16,
    color: 'black',
    fontWeight: 'bold',
  },
});

export default MeasureAreaOnMap;

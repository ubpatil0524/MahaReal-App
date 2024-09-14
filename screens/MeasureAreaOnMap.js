import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Modal,
  FlatList,
  Alert,
} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
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
  const [measurementMode, setMeasurementMode] = useState('Manual Measurement');

  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState(''); // To handle which modal is open

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
        if (measurementMode === 'GPS Measurement') {
          addGPSCoordinate({latitude, longitude});
        }
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
  }, [measurementMode]);

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
      {enableHighAccuracy: false, timeout: 60000, maximumAge: 60000},
    );
  };

  const handleMapPress = e => {
    if (measurementMode === 'Manual Measurement') {
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
    }
  };

  const addGPSCoordinate = coordinate => {
    const newCoords = [...polygonCoords, coordinate];
    setPolygonCoords(newCoords);
    calculateAndUpdateMeasurements(newCoords);
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

  const handleIconPress = type => {
    setModalType(type);
    setModalVisible(true);
  };

  const renderModalContent = () => {
    if (modalType === 'mapType') {
      const options = [
        {label: 'Normal', value: 'standard'},
        {label: 'Satellite', value: 'satellite'},
        {label: 'Hybrid', value: 'hybrid'},
      ];

      return options.map(option => (
        <TouchableOpacity
          key={option.value}
          style={styles.modalOption}
          onPress={() => {
            setMapType(option.value);
            setModalVisible(false);
          }}>
          <Text style={styles.modalOptionText}>{option.label}</Text>
        </TouchableOpacity>
      ));
    } else if (modalType === 'unit') {
      const units = [
        'Square m',
        'Square mm',
        'Square cm',
        'Square km',
        'Square miles',
        'Square yards',
      ];

      return units.map(unit => (
        <TouchableOpacity
          key={unit}
          style={styles.modalOption}
          onPress={() => {
            setSelectedUnit(unit);
            setModalVisible(false);
          }}>
          <Text style={styles.modalOptionText}>{unit}</Text>
        </TouchableOpacity>
      ));
    } else if (modalType === 'measurementMode') {
      const options = [
        {label: 'Manual Measurement', value: 'Manual Measurement'},
        {label: 'GPS Measurement', value: 'GPS Measurement'},
      ];

      return options.map(option => (
        <TouchableOpacity
          key={option.value}
          style={styles.modalOption}
          onPress={() => {
            setMeasurementMode(option.value);
            setModalVisible(false);
          }}>
          <Text style={styles.modalOptionText}>{option.label}</Text>
        </TouchableOpacity>
      ));
    }
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

      {/* Modals for Map Type, Unit, Measurement Mode */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {renderModalContent()}
            <TouchableOpacity
              style={styles.modalClose}
              onPress={() => setModalVisible(false)}>
              <Text style={styles.modalCloseText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Icon Buttons */}
      <View style={styles.dropdownContainer}>
        <View style={styles.pickerRow}>
          {/* Map Type Icon */}
          <TouchableOpacity
            style={styles.iconWrapper}
            onPress={() => handleIconPress('mapType')}>
            <FontAwesome5 name="map" size={30} color="#000" />
            <Text style={styles.iconText}>
              {mapType.charAt(0).toUpperCase() + mapType.slice(1)}
            </Text>
          </TouchableOpacity>

          {/* Measurement Unit Icon */}
          <TouchableOpacity
            style={styles.iconWrapper}
            onPress={() => handleIconPress('unit')}>
            <FontAwesome5 name="ruler-combined" size={30} color="#000" />
            <Text style={styles.iconText}>{selectedUnit}</Text>
          </TouchableOpacity>

          {/* Measurement Mode Icon */}
          <TouchableOpacity
            style={styles.iconWrapper}
            onPress={() => handleIconPress('measurementMode')}>
            <FontAwesome5 name="crosshairs" size={30} color="#000" />
            <Text style={styles.iconText}>
              {measurementMode === 'Manual Measurement' ? 'Manual' : 'GPS'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Area and Perimeter */}
        <View style={styles.measurementsContainer}>
          <Text style={styles.measurementsText}>
            Area: {measurements.area.toFixed(2)} {selectedUnit}
          </Text>
          <View style={{width: 1, height: 25, backgroundColor: 'black'}} />
          <Text style={styles.measurementsText}>
            Perimeter: {measurements.perimeter.toFixed(2)} mm
          </Text>
        </View>
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
  dropdownContainer: {
    position: 'absolute',
    top: 0,
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    zIndex: 1,
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  pickerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between', // Space the icons evenly
  },
  iconWrapper: {
    alignItems: 'center',
    flex: 1, // Take equal space for each icon
    marginHorizontal: 5,
  },
  iconText: {
    fontSize: 12,
    marginTop: 5, // Add some space between icon and text
  },
  measurementsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  measurementsText: {
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
  },
  errorContainer: {
    padding: 10,
    backgroundColor: 'red',
    borderRadius: 5,
  },
  errorText: {
    color: 'white',
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalContent: {
    width: '50%',
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 10,
    alignSelf: 'center',
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 5,
  },
  modalOptionText: {
    fontSize: 18,
  },
  modalClose: {
    marginTop: 20,
    backgroundColor: 'green',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  modalCloseText: {
    fontSize: 20,
    color: 'white',
    textAlign: 'center',
  },
});

export default MeasureAreaOnMap;

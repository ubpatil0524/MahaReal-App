import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

function UnitConverter() {
  const [selectedSection, setSelectedSection] = useState('Area');
  const [values, setValues] = useState({
    '7/12': {He: '', R: '', sqMtr: ''},
    hectare: '',
    acre: '',
    bigha: '',
    guntha: '',
    sqMtr: '',
    sqFt: '',
  });

  const conversionFactors = {
    hectareToSqMtr: 10000,
    acreToSqMtr: 4046.86,
    bighaToSqMtr: 2500,
    gunthaToSqMtr: 101.17,
    sqMtrToSqFt: 10.7639,
  };

  const handleInputChange = (field, value) => {
    const newValue = parseFloat(value) || 0;
    const updatedValues = {...values};

    if (field === 'He' || field === 'R' || field === 'sqMtr') {
      updatedValues['7/12'][field] = newValue.toFixed(2);

      const he = parseFloat(updatedValues['7/12'].He) || 0;
      const r = parseFloat(updatedValues['7/12'].R) || 0;
      const sqMtr = he * 10000 + r * 100;

      updatedValues['7/12'].sqMtr = sqMtr.toFixed(2);

      if (field === 'sqMtr') {
        const heValue = Math.floor(sqMtr / 10000);
        const rValue = Math.floor((sqMtr % 10000) / 100);

        updatedValues['7/12'].He = heValue.toFixed(2);
        updatedValues['7/12'].R = rValue.toFixed(2);
      }
    } else {
      updatedValues[field] = newValue.toFixed(2);
      switch (field) {
        case 'hectare':
          updatedValues.sqMtr = (
            newValue * conversionFactors.hectareToSqMtr
          ).toFixed(2);
          break;
        case 'acre':
          updatedValues.sqMtr = (
            newValue * conversionFactors.acreToSqMtr
          ).toFixed(2);
          break;
        case 'bigha':
          updatedValues.sqMtr = (
            newValue * conversionFactors.bighaToSqMtr
          ).toFixed(2);
          break;
        case 'guntha':
          updatedValues.sqMtr = (
            newValue * conversionFactors.gunthaToSqMtr
          ).toFixed(2);
          break;
        case 'sqMtr':
          updatedValues.sqMtr = newValue.toFixed(2);
          break;
        case 'sqFt':
          updatedValues.sqMtr = (
            newValue / conversionFactors.sqMtrToSqFt
          ).toFixed(2);
          break;
        default:
          break;
      }

      updatedValues.hectare = (
        updatedValues.sqMtr / conversionFactors.hectareToSqMtr
      ).toFixed(2);
      updatedValues.acre = (
        updatedValues.sqMtr / conversionFactors.acreToSqMtr
      ).toFixed(2);
      updatedValues.bigha = (
        updatedValues.sqMtr / conversionFactors.bighaToSqMtr
      ).toFixed(2);
      updatedValues.guntha = (
        updatedValues.sqMtr / conversionFactors.gunthaToSqMtr
      ).toFixed(2);
      updatedValues.sqFt = (
        updatedValues.sqMtr * conversionFactors.sqMtrToSqFt
      ).toFixed(2);
    }

    setValues(updatedValues);
  };

  const renderRow = (label, placeholders, field, isNested = false) => {
    return (
      <View style={styles.row}>
        <View style={styles.labelContainer}>
          <Text style={styles.areaTxt}>{label}</Text>
        </View>
        <View style={styles.inputContainer}>
          {placeholders.map((placeholder, index) => (
            <View key={index} style={styles.TxtContainer}>
              <TextInput
                placeholder={placeholder}
                style={{fontSize: 20}}
                keyboardType="numeric"
                value={
                  isNested
                    ? values[field][placeholders[index].toLowerCase()]
                    : values[field]?.toString() || ''
                }
                onChangeText={value =>
                  isNested
                    ? handleInputChange(
                        placeholders[index].toLowerCase(),
                        value,
                      )
                    : handleInputChange(field, value)
                }
              />
            </View>
          ))}
        </View>
      </View>
    );
  };

  const Area = () => {
    return (
      <>
        {renderRow('7/12', ['He.', 'R', 'sq.mtr'], '7/12', true)}
        {renderRow('Hectare', ['Enter Value'], 'hectare')}
        {renderRow('Acre', ['Enter Value'], 'acre')}
        {renderRow('Bigha', ['Enter Value'], 'bigha')}
        {renderRow('Guntha', ['Enter Value'], 'guntha')}
        {renderRow('sq.mtr', ['Enter Value'], 'sqMtr')}
        {renderRow('sq.ft', ['Enter Value'], 'sqFt')}
      </>
    );
  };

  const Length = () => {
    return (
      <>
        {renderRow('Meter', ['Enter Value'], 'Meter')}
        {renderRow('Feet', ['Enter Value'], 'Feet')}
        {renderRow('Yard', ['Enter Value'], 'Yard')}
        {renderRow('Inch', ['Enter Value'], 'Inch')}
        {renderRow('Centimeter', ['Enter Value'], 'Centimeter')}
      </>
    );
  };

  return (
    <>
      <View style={styles.container}>
        <TouchableOpacity
          style={[
            styles.areaLengthView,
            selectedSection === 'Area' ? styles.selected : styles.unselected,
          ]}
          onPress={() => setSelectedSection('Area')}>
          <Text
            style={[
              styles.TxtareaLength,
              selectedSection === 'Area'
                ? styles.selectedText
                : styles.unselectedText,
            ]}>
            Area
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.areaLengthView,
            selectedSection === 'Length' ? styles.selected : styles.unselected,
          ]}
          onPress={() => setSelectedSection('Length')}>
          <Text
            style={[
              styles.TxtareaLength,
              selectedSection === 'Length'
                ? styles.selectedText
                : styles.unselectedText,
            ]}>
            Length
          </Text>
        </TouchableOpacity>
      </View>

      <View style={{flexDirection: 'column', marginTop: 20}}>
        {selectedSection === 'Area' && <Area />}
        {selectedSection === 'Length' && <Length />}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 30,
  },
  areaLengthView: {
    width: '40%',
    height: 40,
    borderWidth: 1,
    justifyContent: 'center',
    marginHorizontal: 5,
    borderColor: 'green',
  },
  TxtareaLength: {
    fontSize: 20,
    fontWeight: '500',
    textAlign: 'center',
  },
  selected: {
    backgroundColor: 'green',
  },
  unselected: {
    backgroundColor: 'white',
  },
  selectedText: {
    color: 'white',
  },
  unselectedText: {
    color: 'black',
  },
  areaTxt: {
    fontSize: 22,
    color: 'black',
    fontWeight: '500',
    textAlign: 'right',
  },
  TxtContainer: {
    height: 50,
    flex: 1,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
    borderColor: 'green',
  },
  labelContainer: {
    flex: 1,
    alignItems: 'flex-end',
    paddingRight: 10,
  },
  inputContainer: {
    flex: 2,
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 5,
    width: '90%',
    padding: 5,
  },
});

export default UnitConverter;

import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
} from 'react-native';

function UnitConverter() {
  const [selectedSection, setSelectedSection] = useState('Area');
  const [values, setValues] = useState({
    He: '',
    R: '',
    sqMTR: '',
    hectare: '',
    acre: '',
    bigha: '',
    guntha: '',
    sqMtr: '',
    sqFt: '',
    Meter: '',
    Feet: '',
    Yard: '',
    Inch: '',
    Centimeter: '',
  });

  const conversionFactors = {
    heToSqMtr: 10000,
    sqMTRToSqFt: 10.7639,
    hectareToSqMtr: 10000,
    acreToSqMtr: 4046.86,
    bighaToSqMtr: 2500,
    gunthaToSqMtr: 101.17,
    sqMtrToSqFt: 10.7639,

    meterToFeet: 3.28084,
    meterToYard: 1.09361,
    meterToInch: 39.3701,
    meterToCentimeter: 100,
    feetToMeter: 0.3048,
    yardToMeter: 0.9144,
    inchToMeter: 0.0254,
    centimeterToMeter: 0.01,
  };

  const handleInputChange = (field, value) => {
    const updatedValues = {...values};
    const newValue = parseFloat(value) || 0;

    switch (field) {
      case 'He':
        updatedValues.He = newValue.toFixed(2);
        updatedValues.sqMTR = (newValue * conversionFactors.heToSqMtr).toFixed(
          2,
        );
        updatedValues.sqMtr = updatedValues.sqMTR;
        updatedValues.hectare = newValue.toFixed(2);
        updatedValues.acre = (
          (newValue * conversionFactors.hectareToSqMtr) /
          conversionFactors.acreToSqMtr
        ).toFixed(2);
        updatedValues.bigha = (
          (newValue * conversionFactors.hectareToSqMtr) /
          conversionFactors.bighaToSqMtr
        ).toFixed(2);
        updatedValues.guntha = (
          (newValue * conversionFactors.hectareToSqMtr) /
          conversionFactors.gunthaToSqMtr
        ).toFixed(2);
        updatedValues.sqFt = (
          updatedValues.sqMtr * conversionFactors.sqMtrToSqFt
        ).toFixed(2);
        break;
      case 'R':
        updatedValues.R = newValue.toFixed(2);
        updatedValues.guntha = newValue.toFixed(2);
        updatedValues.sqMTR = (
          newValue * conversionFactors.gunthaToSqMtr
        ).toFixed(2);
        updatedValues.sqMtr = updatedValues.sqMTR;
        updatedValues.He = (
          updatedValues.sqMtr / conversionFactors.heToSqMtr
        ).toFixed(2);
        updatedValues.hectare = updatedValues.He;
        updatedValues.acre = (
          updatedValues.sqMtr / conversionFactors.acreToSqMtr
        ).toFixed(2);
        updatedValues.bigha = (
          updatedValues.sqMtr / conversionFactors.bighaToSqMtr
        ).toFixed(2);
        updatedValues.sqFt = (
          updatedValues.sqMtr * conversionFactors.sqMtrToSqFt
        ).toFixed(2);
        break;
      case 'sqMTR':
        updatedValues.sqMTR = newValue.toFixed(2);
        updatedValues.He = (newValue / conversionFactors.heToSqMtr).toFixed(2);
        updatedValues.sqMtr = updatedValues.sqMTR;
        updatedValues.hectare = updatedValues.He;
        updatedValues.acre = (
          updatedValues.sqMtr / conversionFactors.acreToSqMtr
        ).toFixed(2);
        updatedValues.bigha = (
          updatedValues.sqMtr / conversionFactors.bighaToSqMtr
        ).toFixed(2);
        updatedValues.guntha = (
          updatedValues.sqMtr / conversionFactors.gunthaToSqMtr
        ).toFixed(2);
        updatedValues.R = updatedValues.guntha;
        updatedValues.sqFt = (
          updatedValues.sqMtr * conversionFactors.sqMtrToSqFt
        ).toFixed(2);
        break;
      case 'sqMtr':
        updatedValues.sqMtr = newValue.toFixed(2);
        updatedValues.sqMTR = updatedValues.sqMtr;
        updatedValues.He = (newValue / conversionFactors.heToSqMtr).toFixed(2);
        updatedValues.hectare = updatedValues.He;
        updatedValues.acre = (newValue / conversionFactors.acreToSqMtr).toFixed(
          2,
        );
        updatedValues.bigha = (
          newValue / conversionFactors.bighaToSqMtr
        ).toFixed(2);
        updatedValues.guntha = (
          newValue / conversionFactors.gunthaToSqMtr
        ).toFixed(2);
        updatedValues.R = updatedValues.guntha;
        updatedValues.sqFt = (
          updatedValues.sqMtr * conversionFactors.sqMtrToSqFt
        ).toFixed(2);
        break;
      case 'hectare':
        updatedValues.sqMtr = (
          newValue * conversionFactors.hectareToSqMtr
        ).toFixed(2);
        updatedValues.sqMTR = updatedValues.sqMtr;
        updatedValues.He = newValue.toFixed(2);
        updatedValues.acre = (
          (newValue * conversionFactors.hectareToSqMtr) /
          conversionFactors.acreToSqMtr
        ).toFixed(2);
        updatedValues.bigha = (
          (newValue * conversionFactors.hectareToSqMtr) /
          conversionFactors.bighaToSqMtr
        ).toFixed(2);
        updatedValues.guntha = (
          (newValue * conversionFactors.hectareToSqMtr) /
          conversionFactors.gunthaToSqMtr
        ).toFixed(2);
        updatedValues.R = updatedValues.guntha;
        updatedValues.sqFt = (
          updatedValues.sqMtr * conversionFactors.sqMtrToSqFt
        ).toFixed(2);
        break;
      case 'acre':
        updatedValues.sqMtr = (
          newValue * conversionFactors.acreToSqMtr
        ).toFixed(2);
        updatedValues.sqMTR = updatedValues.sqMtr;
        updatedValues.He = (
          (newValue * conversionFactors.acreToSqMtr) /
          conversionFactors.heToSqMtr
        ).toFixed(2);
        updatedValues.hectare = updatedValues.He;
        updatedValues.bigha = (
          (newValue * conversionFactors.acreToSqMtr) /
          conversionFactors.bighaToSqMtr
        ).toFixed(2);
        updatedValues.guntha = (
          (newValue * conversionFactors.acreToSqMtr) /
          conversionFactors.gunthaToSqMtr
        ).toFixed(2);
        updatedValues.R = updatedValues.guntha;
        updatedValues.sqFt = (
          updatedValues.sqMtr * conversionFactors.sqMtrToSqFt
        ).toFixed(2);
        break;
      case 'bigha':
        updatedValues.sqMtr = (
          newValue * conversionFactors.bighaToSqMtr
        ).toFixed(2);
        updatedValues.sqMTR = updatedValues.sqMtr;
        updatedValues.He = (
          (newValue * conversionFactors.bighaToSqMtr) /
          conversionFactors.heToSqMtr
        ).toFixed(2);
        updatedValues.hectare = updatedValues.He;
        updatedValues.acre = (
          (newValue * conversionFactors.bighaToSqMtr) /
          conversionFactors.acreToSqMtr
        ).toFixed(2);
        updatedValues.guntha = (
          (newValue * conversionFactors.bighaToSqMtr) /
          conversionFactors.gunthaToSqMtr
        ).toFixed(2);
        updatedValues.R = updatedValues.guntha;
        updatedValues.sqFt = (
          updatedValues.sqMtr * conversionFactors.sqMtrToSqFt
        ).toFixed(2);
        break;
      case 'guntha':
        updatedValues.guntha = newValue.toFixed(2);
        updatedValues.sqMtr = (
          newValue * conversionFactors.gunthaToSqMtr
        ).toFixed(2);
        updatedValues.sqMTR = updatedValues.sqMtr;
        updatedValues.He = (
          updatedValues.sqMtr / conversionFactors.heToSqMtr
        ).toFixed(2);
        updatedValues.hectare = updatedValues.He;
        updatedValues.acre = (
          updatedValues.sqMtr / conversionFactors.acreToSqMtr
        ).toFixed(2);
        updatedValues.bigha = (
          updatedValues.sqMtr / conversionFactors.bighaToSqMtr
        ).toFixed(2);
        updatedValues.R = updatedValues.guntha;
        updatedValues.sqFt = (
          updatedValues.sqMtr * conversionFactors.sqMtrToSqFt
        ).toFixed(2);
        break;
      case 'sqFt':
        updatedValues.sqMtr = (
          newValue / conversionFactors.sqMtrToSqFt
        ).toFixed(2);
        updatedValues.sqMTR = updatedValues.sqMtr;
        updatedValues.He = (
          updatedValues.sqMtr / conversionFactors.heToSqMtr
        ).toFixed(2);
        updatedValues.hectare = updatedValues.He;
        updatedValues.acre = (
          updatedValues.sqMtr / conversionFactors.acreToSqMtr
        ).toFixed(2);
        updatedValues.bigha = (
          updatedValues.sqMtr / conversionFactors.bighaToSqMtr
        ).toFixed(2);
        updatedValues.guntha = (
          updatedValues.sqMtr / conversionFactors.gunthaToSqMtr
        ).toFixed(2);
        updatedValues.R = updatedValues.guntha;
        break;
      case 'Meter':
        updatedValues.Meter = newValue.toFixed(2);
        updatedValues.Feet = (newValue * conversionFactors.meterToFeet).toFixed(
          2,
        );
        updatedValues.Yard = (newValue * conversionFactors.meterToYard).toFixed(
          2,
        );
        updatedValues.Inch = (newValue * conversionFactors.meterToInch).toFixed(
          2,
        );
        updatedValues.Centimeter = (
          newValue * conversionFactors.meterToCentimeter
        ).toFixed(2);
        break;
      case 'Feet':
        updatedValues.Feet = newValue.toFixed(2);
        updatedValues.Meter = (
          newValue * conversionFactors.feetToMeter
        ).toFixed(2);
        updatedValues.Yard = (
          newValue *
          conversionFactors.feetToMeter *
          conversionFactors.meterToYard
        ).toFixed(2);
        updatedValues.Inch = (
          newValue *
          conversionFactors.feetToMeter *
          conversionFactors.meterToInch
        ).toFixed(2);
        updatedValues.Centimeter = (
          newValue *
          conversionFactors.feetToMeter *
          conversionFactors.meterToCentimeter
        ).toFixed(2);
        break;
      case 'Yard':
        updatedValues.Yard = newValue.toFixed(2);
        updatedValues.Meter = (
          newValue * conversionFactors.yardToMeter
        ).toFixed(2);
        updatedValues.Feet = (
          newValue *
          conversionFactors.yardToMeter *
          conversionFactors.meterToFeet
        ).toFixed(2);
        updatedValues.Inch = (
          newValue *
          conversionFactors.yardToMeter *
          conversionFactors.meterToInch
        ).toFixed(2);
        updatedValues.Centimeter = (
          newValue *
          conversionFactors.yardToMeter *
          conversionFactors.meterToCentimeter
        ).toFixed(2);
        break;
      case 'Inch':
        updatedValues.Inch = newValue.toFixed(2);
        updatedValues.Meter = (
          newValue * conversionFactors.inchToMeter
        ).toFixed(2);
        updatedValues.Feet = (
          newValue *
          conversionFactors.inchToMeter *
          conversionFactors.meterToFeet
        ).toFixed(2);
        updatedValues.Yard = (
          newValue *
          conversionFactors.inchToMeter *
          conversionFactors.meterToYard
        ).toFixed(2);
        updatedValues.Centimeter = (
          newValue *
          conversionFactors.inchToMeter *
          conversionFactors.meterToCentimeter
        ).toFixed(2);
        break;
      case 'Centimeter':
        updatedValues.Centimeter = newValue.toFixed(2);
        updatedValues.Meter = (
          newValue * conversionFactors.centimeterToMeter
        ).toFixed(2);
        updatedValues.Feet = (
          newValue *
          conversionFactors.centimeterToMeter *
          conversionFactors.meterToFeet
        ).toFixed(2);
        updatedValues.Yard = (
          newValue *
          conversionFactors.centimeterToMeter *
          conversionFactors.meterToYard
        ).toFixed(2);
        updatedValues.Inch = (
          newValue *
          conversionFactors.centimeterToMeter *
          conversionFactors.meterToInch
        ).toFixed(2);
        break;
      default:
        break;
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
        {renderRow('He.', ['He.'], 'He')}
        {renderRow('R', ['R'], 'R')}
        {renderRow('sq.mtr', ['sq.mtr'], 'sqMTR')}
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
      <ScrollView>
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
              selectedSection === 'Length'
                ? styles.selected
                : styles.unselected,
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
      </ScrollView>
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

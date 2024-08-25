import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';

const SearchReport = () => {
    const [selectedLanguage, setSelectedLanguage] = useState();

    return (
        <View style={styles.mainContainer}>
            <View style={styles.container}>
                <TouchableOpacity style={styles.surveyView}>
                    <View>
                        <Text style={styles.surveyTxt}>Survey no.</Text>
                    </View>
                </TouchableOpacity>
            </View>

            <View style={styles.pickerContainer}>
                <Text style={styles.placeholderTxt}>State</Text>
                <Picker
                    selectedValue={selectedLanguage}
                    onValueChange={(itemValue, itemIndex) =>
                        setSelectedLanguage(itemValue)
                    }
                // style={styles.picker}
                >
                    <Picker.Item label="Maharashtra" value="java" />
                </Picker>
            </View>

            <View style={styles.pickerContainer}>
                <Text style={styles.placeholderTxt}>District</Text>
                <Picker
                    selectedValue={selectedLanguage}
                    onValueChange={(itemValue, itemIndex) =>
                        setSelectedLanguage(itemValue)
                    }
                // style={styles.picker}
                >
                    <Picker.Item label="Maharashtra" value="java" />
                </Picker>
            </View>


            <View style={styles.pickerContainer}>
                <Text style={styles.placeholderTxt}>Taluka</Text>
                <Picker
                    selectedValue={selectedLanguage}
                    onValueChange={(itemValue, itemIndex) =>
                        setSelectedLanguage(itemValue)
                    }
                // style={styles.picker}
                >
                    <Picker.Item label="Maharashtra" value="java" />
                </Picker>
            </View>

            <View style={styles.pickerContainer}>
                <Text style={styles.placeholderTxt}>Village</Text>
                <Picker
                    selectedValue={selectedLanguage}
                    onValueChange={(itemValue, itemIndex) =>
                        setSelectedLanguage(itemValue)
                    }
                // style={styles.picker}
                >
                    <Picker.Item label="Maharashtra" value="java" />
                </Picker>
            </View>

            <View style={styles.pickerContainer}>
                <Text style={styles.placeholderTxt}>Gat/Survey no./CTS no.</Text>
                <Picker
                    selectedValue={selectedLanguage}
                    onValueChange={(itemValue, itemIndex) =>
                        setSelectedLanguage(itemValue)
                    }
                // style={styles.picker}
                >
                    <Picker.Item label="Maharashtra" value="java" />
                </Picker>
            </View>


            <View style={styles.searchView}>
                <Text style={styles.searchTxt}>Search</Text>
            </View>

        </View>
    );
};

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
    },
    container: {
        alignItems: 'center',
        marginBottom: 20,
    },
    surveyTxt: {
        fontSize: 22,
        color: 'white',
        fontWeight: '700'
    },
    surveyView: {
        backgroundColor: 'green',
        width: '40%',
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 20,
        alignSelf: 'center',
        margin: 15,
    },
    pickerContainer: {
        width: '90%',
        alignSelf: 'center',
        borderBottomWidth: 1,
        borderBottomColor: 'green'
    },
    placeholderTxt: {
        color: 'green',
        fontSize: 16
    },
    searchView: {
        backgroundColor: 'green',
        width: '40%',
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        alignSelf: 'center',
        marginTop: 25,
    },
    searchTxt: {
        color: 'white', fontSize: 18, fontWeight: '700'
    }
});

export default SearchReport;

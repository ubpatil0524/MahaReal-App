import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import SplashScreen from './screens/SplashScreen';
import SearchReport from './screens/SearchReport';
import HomeScreen from './screens/HomeSreen';
import UnitConverter from './screens/UnitConverter';
import MeasureAreaOnMap from './screens/MeasureAreaOnMap';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash">
        <Stack.Screen
          name="Splash"
          component={SplashScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen name="MahaReal" component={HomeScreen} />
        <Stack.Screen name="Search" component={SearchReport} />
        <Stack.Screen name="UnitConverter" component={UnitConverter} />
        <Stack.Screen
          name="MeasureAreaOnMap"
          component={MeasureAreaOnMap}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;

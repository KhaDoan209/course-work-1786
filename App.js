import { LogBox, StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeRoute from './screens/HomeRoute';
import { useEffect } from 'react';
import { NativeBaseProvider } from 'native-base';
import Database from './Database';
import HikeDetail from './screens/Hike/HikeDetail';
const Stack = createStackNavigator();
export default function App() {
   useEffect(() => {
      Database.initDatabase();
      LogBox.ignoreLogs([
         'In React 18, SSRProvider is not necessary and is a noop. You can remove it from your app.',
      ]);
   }, []);

   return (
      <NativeBaseProvider>
         <NavigationContainer>
            <Stack.Navigator initialRouteName='Home'>
               <Stack.Screen
                  name='Home Page'
                  component={HomeRoute}
                  options={{ headerShown: false }}
               />
               <Stack.Screen
                  name='Hike Detail'
                  component={HikeDetail}
               />
            </Stack.Navigator>
         </NavigationContainer>
      </NativeBaseProvider>
   );
}

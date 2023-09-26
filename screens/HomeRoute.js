import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from './HomeScreen';
import Icon from 'react-native-vector-icons/FontAwesome';
import AddNewHike from './Hike/AddNewHike';
const HomeRoute = () => {
   const Tab = createBottomTabNavigator();
   return (
      <Tab.Navigator
         screenOptions={({ route }) => ({
            tabBarActiveTintColor: '#FFB4B4',
            tabBarInactiveTintColor: '#374B73',
         })}
      >
         <Tab.Screen
            name='Home'
            component={HomeScreen}
            options={{
               tabBarIcon: ({ color, size }) => (
                  <Icon
                     name='home'
                     color={color}
                     size={size}
                  />
               ),
               headerShown: false,
            }}
         />
         <Tab.Screen
            name='New Hike'
            component={AddNewHike}
            options={{
               tabBarIcon: ({ color, size }) => (
                  <Icon
                     name='plus'
                     color={color}
                     size={size}
                  />
               ),
               headerShown: false,
            }}
         />
         {/* <Tab.Screen
            name='Add'
            component={EntryScreen}
         />
         <Tab.Screen
            name='Search'
            component={SearchScreen}
         /> */}
      </Tab.Navigator>
   );
};

export default HomeRoute;

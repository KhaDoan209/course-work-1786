import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Flex } from 'native-base';
export const RadioButtonGroup = (props) => {
   const [option1Selected, setOption1Selected] = useState(props.defaultValue);
   const [option2Selected, setOption2Selected] = useState(!props.defaultValue);

   const selectOption1 = () => {
      setOption1Selected(true);
      setOption2Selected(false);
   };

   const selectOption2 = () => {
      setOption1Selected(false);
      setOption2Selected(true);
   };

   return (
      <View>
         <Flex
            direction='row'
            width={'full'}
            alignItems='center'
         >
            <TouchableOpacity
               onPress={() => {
                  selectOption1();
                  props.onChange(true);
               }}
            >
               <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Icon
                     name={option1Selected ? 'dot-circle-o' : 'circle-o'}
                     size={24}
                     style={styles.label}
                  />
                  <Text style={styles.label}>{props.label1}</Text>
               </View>
            </TouchableOpacity>
            <TouchableOpacity
               onPress={() => {
                  selectOption2();
                  props.onChange(false);
               }}
               style={styles.ml_1}
            >
               <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Icon
                     style={styles.label}
                     name={option2Selected ? 'dot-circle-o' : 'circle-o'}
                     size={24}
                  />
                  <Text style={styles.label}>{props.label2}</Text>
               </View>
            </TouchableOpacity>
         </Flex>
      </View>
   );
};
const styles = StyleSheet.create({
   ml_1: {
      marginLeft: 30,
   },
   label: {
      color: '#374B73',
      marginLeft: 8,
   },
});

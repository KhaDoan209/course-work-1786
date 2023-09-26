import React, { useEffect } from 'react';
import { Flex, Input, Text, Button, TextArea, Box } from 'native-base';
import {
   Dimensions,
   StyleSheet,
   View,
   Alert,
   TouchableOpacity,
   Keyboard,
   ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useState, useRef } from 'react';
import { useFormik } from 'formik';
import { RadioButtonGroup } from '../../components/RadioButton';
import SelectDropdown from 'react-native-select-dropdown';
import * as Yup from 'yup';
import { useToast } from 'native-base';
import Database from '../../Database';
import { useIsFocused, useNavigation } from '@react-navigation/native';
const HikeDetail = ({ route }) => {
   const [hikeDetail, setHikeDetail] = useState(route.params.hike);
   const {
      name,
      date,
      location,
      difficulty_level,
      length,
      id,
      parking_available,
      description,
   } = hikeDetail;
   const isFocused = useIsFocused();
   const navigation = useNavigation();
   const toast = useToast();
   const dropdown = useRef(null);
   const [onUpdate, setOnUpdate] = useState(false);

   const renderDifficultyLevel = (level) => {
      switch (level) {
         case 'High':
            return <Text color={'red.500'}>High</Text>;
         case 'Medium':
            return <Text color={'yellow.400'}>Medium</Text>;
         case 'Low':
            return <Text color={'green.500'}>Easy</Text>;
         default:
            break;
      }
   };
   const level = ['High', 'Medium', 'Low'];
   const formik = useFormik({
      enableReinitialize: true,
      initialValues: {
         name: name,
         location: location,
         date: date,
         parking_available: parking_available,
         length: length,
         difficulty_level: difficulty_level,
         description: description,
      },
      validationSchema: Yup.object().shape({
         name: Yup.string().required('Name is required'),
         location: Yup.string().required('Location is required'),
         date: Yup.string().required('Date is required'),
         length: Yup.string().required('Length is required'),
         difficulty_level: Yup.string().required('Difficulty is required'),
      }),
      onSubmit: async (values) => {
         Database.updateHike(id, values);
         toast.show({
            description: '',
            duration: 800,
            render: () => {
               return (
                  <Box
                     bg='emerald.500'
                     px='3'
                     py='2'
                     rounded='sm'
                     mb={5}
                  >
                     <Text
                        fontWeight={'bold'}
                        color={'white'}
                     >
                        Hike updated successfully
                     </Text>
                  </Box>
               );
            },
         });
         setOnUpdate(false);
         const data = await Database.getHikeDetail(id);
         setHikeDetail(data);
      },
   });
   const chooseParkingAvailable = (value) => {
      formik.setFieldValue('parking_available', value);
   };
   const handleOnUpdate = () => {
      Alert.alert('Do you want to update?', ``, [
         {
            text: 'Cancel',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
         },
         {
            text: 'OK',
            onPress: () => {
               formik.handleSubmit();
            },
         },
      ]);
   };
   return (
      <TouchableOpacity
         onPress={Keyboard.dismiss}
         activeOpacity={1}
      >
         <View style={styles.container}>
            <View style={styles.hike_detail_container}>
               <Flex
                  flexDirection={'row'}
                  alignItems={'center'}
                  justifyContent={'space-between'}
               >
                  {onUpdate ? (
                     <Input
                        borderBottomColor={'#374B73'}
                        fontSize='3xl'
                        onChangeText={formik.handleChange('name')}
                        variant='underlined'
                        value={formik.values.name}
                        width={200}
                        marginLeft={4}
                     />
                  ) : (
                     <Text
                        color={'#374B73'}
                        fontWeight={'bold'}
                        fontSize={'3xl'}
                        marginLeft={1}
                     >
                        {name}
                     </Text>
                  )}
                  <Icon
                     onPress={() => {
                        setOnUpdate(!onUpdate);
                     }}
                     name='pen'
                     color={!onUpdate ? '#374B73' : '#FFBB5C'}
                     size={25}
                  />
               </Flex>
               <Flex
                  marginTop={5}
                  flexDirection={'row'}
                  alignItems={'center'}
               >
                  <View marginRight={10}>
                     <Icon
                        name='calendar'
                        color='#374B73'
                        size={25}
                     />
                  </View>
                  <Flex
                     flexDirection={'row'}
                     alignItems={'center'}
                  >
                     <Text
                        color={'#374B73'}
                        fontFamily={'mono'}
                        fontWeight={'bold'}
                        fontSize={'xl'}
                     >
                        Created at:
                     </Text>
                     <Text
                        color={'#374B73'}
                        fontWeight={'bold'}
                        fontSize={'xl'}
                        marginLeft={2}
                     >
                        {date}
                     </Text>
                  </Flex>
               </Flex>
               <Flex
                  marginTop={5}
                  flexDirection={'row'}
                  alignItems={'center'}
               >
                  <View marginRight={10}>
                     <Icon
                        name='ruler'
                        color='#374B73'
                        size={25}
                     />
                  </View>
                  <Flex
                     flexDirection={'row'}
                     alignItems={'center'}
                  >
                     <Text
                        color={'#374B73'}
                        fontFamily={'mono'}
                        fontWeight={'bold'}
                        fontSize={'xl'}
                     >
                        Length:
                     </Text>
                     {onUpdate ? (
                        <Input
                           borderBottomColor={'#374B73'}
                           fontSize='16'
                           onChangeText={formik.handleChange('length')}
                           variant='underlined'
                           value={formik.values.length}
                           width={170}
                           marginLeft={4}
                        />
                     ) : (
                        <Text
                           color={'#374B73'}
                           fontWeight={'bold'}
                           fontSize={'xl'}
                           marginLeft={2}
                        >
                           {length} km
                        </Text>
                     )}
                  </Flex>
               </Flex>
               <Flex
                  marginTop={5}
                  flexDirection={'row'}
                  alignItems={'center'}
               >
                  <View marginRight={10}>
                     <Icon
                        name='alert-octagon-outline'
                        color='#374B73'
                        size={25}
                     />
                  </View>
                  <Flex
                     flexDirection={'row'}
                     alignItems={'center'}
                  >
                     <Text
                        color={'#374B73'}
                        fontFamily={'mono'}
                        fontWeight={'bold'}
                        fontSize={'xl'}
                     >
                        Dificulty level:
                     </Text>
                     {onUpdate ? (
                        <SelectDropdown
                           ref={dropdown}
                           buttonStyle={{
                              backgroundColor: 'transparent',
                              borderColor: '#374B73',
                              borderBottomWidth: 1,
                              width: 170,
                           }}
                           buttonTextStyle={{
                              color: '#374B73',
                              fontSize: 16,
                           }}
                           data={level}
                           onSelect={(selectedItem, index) => {
                              formik.setFieldValue(
                                 'difficulty_level',
                                 selectedItem
                              );
                           }}
                           buttonTextAfterSelection={(selectedItem, index) => {
                              return selectedItem;
                           }}
                           rowTextForSelection={(item, index) => {
                              return item;
                           }}
                           renderDropdownIcon={(isOpened) => {
                              return (
                                 <Icon
                                    name={
                                       isOpened ? 'chevron-up' : 'chevron-down'
                                    }
                                    color='#374B73'
                                    size={15}
                                 />
                              );
                           }}
                           dropdownIconPosition={'right'}
                           defaultButtonText={'Select difficulty'}
                           defaultValue={formik.values.difficulty_level}
                        />
                     ) : (
                        <Text
                           color={'#374B73'}
                           fontWeight={'bold'}
                           fontSize={'xl'}
                           marginLeft={2}
                        >
                           {renderDifficultyLevel(difficulty_level)}
                        </Text>
                     )}
                  </Flex>
               </Flex>
               <Flex
                  marginTop={5}
                  flexDirection={'row'}
                  alignItems={'center'}
               >
                  <View marginRight={10}>
                     <Icon
                        name='map-marker-radius'
                        color='#374B73'
                        size={25}
                     />
                  </View>
                  <Flex
                     flexDirection={'row'}
                     alignItems={'center'}
                  >
                     <Text
                        color={'#374B73'}
                        fontFamily={'mono'}
                        fontWeight={'bold'}
                        fontSize={'xl'}
                     >
                        Location:
                     </Text>
                     {onUpdate ? (
                        <Input
                           borderBottomColor={'#374B73'}
                           fontSize='16'
                           onChangeText={formik.handleChange('location')}
                           variant='underlined'
                           value={formik.values.location}
                           width={170}
                           marginLeft={4}
                        />
                     ) : (
                        <Text
                           color={'#374B73'}
                           fontWeight={'bold'}
                           fontSize={'xl'}
                           marginLeft={2}
                        >
                           {location}
                        </Text>
                     )}
                  </Flex>
               </Flex>
               <Flex
                  marginTop={5}
                  flexDirection={'row'}
                  alignItems={'center'}
               >
                  <View marginRight={10}>
                     <Icon
                        name='car-brake-parking'
                        color='#374B73'
                        size={25}
                     />
                  </View>
                  <Flex
                     flexDirection={'row'}
                     alignItems={'center'}
                  >
                     <Text
                        color={'#374B73'}
                        fontFamily={'mono'}
                        fontWeight={'bold'}
                        fontSize={'xl'}
                     >
                        Has parking:
                     </Text>
                     {onUpdate ? (
                        <RadioButtonGroup
                           label1='Yes'
                           label2='No'
                           onChange={chooseParkingAvailable}
                           defaultValue={
                              formik.values.parking_available == 1
                                 ? true
                                 : false
                           }
                        />
                     ) : (
                        <Text
                           color={'#374B73'}
                           fontWeight={'bold'}
                           fontSize={'xl'}
                           marginLeft={2}
                        >
                           {parking_available == 1 ? 'Yes' : 'No'}
                        </Text>
                     )}
                  </Flex>
               </Flex>
               <Flex
                  marginTop={5}
                  flexDirection={'row'}
                  alignItems={'center'}
               >
                  <View marginRight={10}>
                     <Icon
                        name='file-document-multiple-outline'
                        color='#374B73'
                        size={25}
                     />
                  </View>

                  <Text
                     color={'#374B73'}
                     fontFamily={'mono'}
                     fontWeight={'bold'}
                     fontSize={'xl'}
                  >
                     Description:
                  </Text>
               </Flex>
               {onUpdate ? (
                  <></>
               ) : (
                  <ScrollView
                     marginLeft={30}
                     marginBottom={10}
                  >
                     <Text
                        color={'#374B73'}
                        fontWeight={'bold'}
                        fontSize={'md'}
                        marginLeft={2}
                        marginTop={2}
                     >
                        {description}
                     </Text>
                  </ScrollView>
               )}
               {onUpdate ? (
                  <TextArea
                     size='md'
                     onChangeText={formik.handleChange('description')}
                     mt={'3'}
                     borderRadius={8}
                     borderColor={'#374B73'}
                     value={formik.values.description}
                     width={330}
                  />
               ) : (
                  <></>
               )}
               {onUpdate ? (
                  <View
                     marginTop={10}
                     marginBottom={10}
                  >
                     <Button
                        onPress={handleOnUpdate}
                        style={styles.button}
                     >
                        <Text
                           fontWeight={'bold'}
                           color={'white'}
                        >
                           Update
                        </Text>
                     </Button>
                  </View>
               ) : (
                  <></>
               )}
            </View>
         </View>
      </TouchableOpacity>
   );
};

const styles = StyleSheet.create({
   container: {
      paddingTop: 20,
      paddingHorizontal: 25,
      backgroundColor: 'white',
      height: Dimensions.get('window').height,
   },
   hike_detail_container: {
      backgroundColor: '#fcfaf9',
      paddingHorizontal: 15,
      paddingVertical: 10,
      borderRadius: 8,
      shadowColor: 'black',
      shadowOffset: { height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 2,
   },
   button: {
      backgroundColor: '#374B73',
      color: 'white',
      marginTop: 20,
      fontWeight: 'bold',
   },
});
export default HikeDetail;

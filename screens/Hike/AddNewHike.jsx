import React, { useState, useRef } from 'react';
import {
   StyleSheet,
   View,
   Alert,
   Keyboard,
   TouchableOpacity,
   KeyboardAvoidingView,
   ScrollView,
   Dimensions,
} from 'react-native';
import { Text, Input, Flex, TextArea, Button, Box } from 'native-base';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/FontAwesome';
import { RadioButtonGroup } from '../../components/RadioButton';
import SelectDropdown from 'react-native-select-dropdown';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Database from '../../Database';
import { useToast } from 'native-base';
const AddNewHike = ({ navigation }) => {
   const [date, setDate] = useState(new Date());
   const [show, setShow] = useState(false);
   const dropdown = useRef(null);
   const level = ['High', 'Medium', 'Low'];
   const toast = useToast();
   const formik = useFormik({
      initialValues: {
         name: '',
         location: '',
         date: date.toLocaleDateString(),
         parking_available: true,
         length: '',
         difficulty_level: '',
         description: '',
      },
      validationSchema: Yup.object().shape({
         name: Yup.string().required('Name is required'),
         location: Yup.string().required('Location is required'),
         length: Yup.string().required('Length is required'),
         difficulty_level: Yup.string().required('Difficulty is required'),
      }),
      onSubmit: async (values) => {
         await Database.addNewHike(values);
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
                        New hike added
                     </Text>
                  </Box>
               );
            },
         });
      },
   });

   const onCreateNewHike = () => {
      if (Object.keys(formik.errors).length > 0) {
         Alert.alert(
            'Invalid Hike Information',
            'Please fill all required value',
            [{ text: 'OK', onPress: () => console.log('OK Pressed') }]
         );
      } else {
         const {
            name,
            location,
            date,
            parking_available,
            length,
            difficulty_level,
            description,
         } = formik.values;
         Alert.alert(
            'New hike ?',
            `Hike name: ${name} \nLocation: ${location} \nDate: ${date} \nParking available: ${
               parking_available ? 'Yes' : ' No'
            }\nLength: ${length}\nLevel of difficulties: ${difficulty_level}\nDescription: ${description} `,
            [
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
            ]
         );
      }
   };
   const onDatePickerChange = (event, selectedDate) => {
      const currentDate = selectedDate;
      setShow(false);
      setDate(currentDate);
      formik.setFieldValue('date', selectedDate.toLocaleDateString());
   };
   const showDatepicker = () => {
      setShow(true);
   };
   const chooseParkingAvailable = (value) => {
      formik.setFieldValue('parking_available', value);
   };
   return (
      <TouchableOpacity
         onPress={Keyboard.dismiss}
         activeOpacity={1}
      >
         <ScrollView style={styles.container}>
            <View style={styles.inputContainer}>
               <Text
                  style={styles.label}
                  fontWeight='bold'
                  fontSize='lg'
               >
                  Name of hike<Text style={styles.required}>*</Text>
               </Text>
               <Input
                  borderBottomColor={'#374B73'}
                  size='md'
                  onChangeText={formik.handleChange('name')}
                  variant='underlined'
                  value={formik.values.name}
               />
            </View>
            <View style={styles.inputContainer}>
               <Text
                  style={styles.label}
                  fontWeight='bold'
                  fontSize='lg'
               >
                  Location<Text style={styles.required}>*</Text>
               </Text>
               <Input
                  borderBottomColor={'#374B73'}
                  size='md'
                  onChangeText={formik.handleChange('location')}
                  variant='underlined'
               />
            </View>
            <View style={styles.inputContainer}>
               <Text
                  style={styles.label}
                  fontWeight='bold'
                  fontSize='lg'
               >
                  Date<Text style={styles.required}>*</Text>
               </Text>
               <Flex
                  mt={5}
                  direction='row'
                  width={'full'}
                  alignItems='center'
               >
                  <Icon
                     onPress={showDatepicker}
                     name='calendar'
                     color='#374B73'
                     size={30}
                  />
                  {!show ? (
                     <View marginLeft={35}>
                        <Text
                           onPress={showDatepicker}
                           fontSize={'lg'}
                           fontWeight={'bold'}
                           color='#374B73'
                        >
                           {date.toLocaleDateString()}
                        </Text>
                     </View>
                  ) : (
                     <></>
                  )}

                  {show && (
                     <DateTimePicker
                        testID='dateTimePicker'
                        value={date}
                        mode='date'
                        is24Hour={true}
                        onChange={onDatePickerChange}
                        style={{
                           width: 150,
                        }}
                     />
                  )}
               </Flex>
            </View>
            <View style={styles.inputContainer}>
               <Flex
                  mt={5}
                  flexDirection={'row'}
                  justifyContent={'space-between'}
                  alignItems={'center'}
               >
                  <Text
                     style={styles.label}
                     fontWeight='bold'
                     fontSize='lg'
                  >
                     Is parking available ?
                     <Text style={styles.required}>*</Text>
                  </Text>
                  <Flex
                     style={styles.mt_1}
                     justifyContent={'space-between'}
                  >
                     <RadioButtonGroup
                        label1='Yes'
                        label2='No'
                        onChange={chooseParkingAvailable}
                        defaultValue={true}
                     />
                  </Flex>
               </Flex>
            </View>
            <View style={styles.inputContainer}>
               <Flex
                  flexDirection={'row'}
                  justifyContent={'space-between'}
                  alignItems={'center'}
               >
                  <Text
                     style={[styles.label, styles.mt_1]}
                     fontWeight='bold'
                     fontSize='lg'
                  >
                     Length (km):
                     <Text style={styles.required}>*</Text>
                  </Text>
                  <Input
                     marginLeft={1}
                     borderBottomColor={'#374B73'}
                     size='md'
                     onChangeText={formik.handleChange('length')}
                     width={200}
                     variant='underlined'
                  />
               </Flex>
            </View>
            <View style={styles.inputContainer}>
               <Flex
                  flexDirection={'row'}
                  align={'center'}
               >
                  <Text
                     style={[styles.label, styles.mr_1]}
                     fontWeight='bold'
                     fontSize='lg'
                  >
                     Level of difficulties:
                     <Text style={styles.required}>*</Text>
                  </Text>
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
                        formik.setFieldValue('difficulty_level', selectedItem);
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
                              name={isOpened ? 'chevron-up' : 'chevron-down'}
                              color='#374B73'
                              size={15}
                           />
                        );
                     }}
                     dropdownIconPosition={'right'}
                     defaultButtonText={'Select difficulty'}
                  />
               </Flex>
            </View>
            <View style={styles.inputContainer}>
               <Text
                  style={styles.label}
                  fontWeight='bold'
                  fontSize='lg'
               >
                  Description
               </Text>
               <TextArea
                  size='md'
                  onChangeText={formik.handleChange('description')}
                  mt={'3'}
                  borderRadius={8}
                  borderColor={'#374B73'}
                  value={formik.values.description}
               />
            </View>

            <Button
               onPress={() => {
                  onCreateNewHike();
               }}
               style={styles.button}
            >
               Create new hike
            </Button>
         </ScrollView>
      </TouchableOpacity>
   );
};

const styles = StyleSheet.create({
   container: {
      backgroundColor: 'white',
      paddingTop: 70,
      paddingHorizontal: 30,
      height: Dimensions.get('window').height,
   },
   inputContainer: {
      marginVertical: 10,
   },
   label: {
      color: '#374B73',
   },
   ml_1: {
      marginLeft: 20,
   },
   mt_1: {
      marginTop: 10,
   },
   mr_1: {
      marginRight: 10,
   },
   img: {
      height: 20,
      width: 20,
   },
   btn: {
      flexDirection: 'row',
   },
   dropdown2DropdownStyle: { backgroundColor: '#EFEFEF' },
   dropdown2RowStyle: {
      backgroundColor: '#EFEFEF',
      borderBottomColor: '#C5C5C5',
   },
   button: {
      backgroundColor: '#374B73',
      color: 'white',
      marginTop: 20,
      fontWeight: 'bold',
   },
   required: {
      color: 'red',
      marginLeft: 3,
   },
   error: {
      color: 'red',
   },
});
export default AddNewHike;

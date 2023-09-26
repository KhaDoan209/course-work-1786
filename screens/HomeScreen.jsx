import { useIsFocused } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
   TouchableOpacity,
   View,
   FlatList,
   Dimensions,
   Alert,
   Modal,
   Pressable,
   ScrollView,
} from 'react-native';
import { Text, Flex, Button, Box } from 'native-base';
import Database from '../Database';
import { StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Entypo';
import { useToast } from 'native-base';
const HomeScreen = ({ navigation }) => {
   const [idToManipulate, setIdToManipulate] = useState(null);
   const isFocused = useIsFocused();
   const [listHike, setListHike] = useState([]);
   const [modalVisible, setModalVisible] = useState(false);
   const toast = useToast();
   useEffect(() => {
      const fetchData = async () => {
         try {
            const data = await Database.getListHike();
            setListHike(data);
         } catch (error) {
            console.log('Error fetching hike', error);
         }
      };
      fetchData();
   }, [isFocused]);
   const renderDifficultyLevel = (level) => {
      switch (level) {
         case 'High':
            return <Text color={'red.500'}>High</Text>;
         case 'Medium':
            return <Text color={'yellow.600'}>Medium</Text>;
         case 'Low':
            return <Text color={'green.500'}>Easy</Text>;
         default:
            break;
      }
   };
   const renderListHike = ({ item }) => {
      return (
         <TouchableOpacity
            onPress={() => navigation.navigate('Hike Detail', { hike: item })}
            style={styles.hike_container}
            activeOpacity={0.7}
            onLongPress={() => {
               setIdToManipulate(item.id);
               setModalVisible(true);
            }}
         >
            <View key={item.id}>
               <View style={styles.hike_content}>
                  <Flex
                     flexDirection={'row'}
                     justifyContent={'space-between'}
                     alignItems={'baseline'}
                  >
                     <Text
                        color={'#374B73'}
                        fontWeight={'bold'}
                        fontSize={'lg'}
                     >
                        {item.name}
                     </Text>
                     <Text
                        color={'gray.400'}
                        fontWeight={'bold'}
                        fontSize={'sm'}
                     >
                        {item.date}
                     </Text>
                  </Flex>
                  <Flex
                     marginTop={3}
                     direction='row'
                  >
                     <Text
                        color={'#374B73'}
                        fontWeight={'bold'}
                        fontSize={'md'}
                     >
                        Difficulty:
                     </Text>
                     <Text
                        color={'#374B73'}
                        fontWeight={'bold'}
                        fontSize={'md'}
                        marginLeft={1}
                     >
                        {renderDifficultyLevel(item.difficulty_level)}
                     </Text>
                  </Flex>
                  <Flex
                     marginTop={4}
                     direction='row'
                  >
                     <Icon
                        name='location'
                        color='#374B73'
                        size={20}
                     />
                     <Text
                        color={'#374B73'}
                        fontWeight={'bold'}
                        fontSize={'md'}
                        marginLeft={2}
                     >
                        {item.location}
                     </Text>
                  </Flex>
               </View>
            </View>
         </TouchableOpacity>
      );
   };

   return (
      <View
         style={{
            backgroundColor: 'white',
            height: Dimensions.get('window').height,
         }}
      >
         <FlatList
            style={styles.container}
            data={listHike}
            renderItem={renderListHike}
            keyExtractor={(item) => item.id.toString()}
            numColumns={1}
         ></FlatList>
         <View style={styles.centeredView}>
            <Modal
               animationType='fade'
               transparent={true}
               visible={modalVisible}
               onRequestClose={() => {
                  setModalVisible(!modalVisible);
               }}
            >
               <TouchableOpacity
                  onPress={() => setModalVisible(!modalVisible)}
                  style={styles.overlay}
                  activeOpacity={1}
               >
                  <View style={styles.centeredView}>
                     <View style={styles.modalView}>
                        <Flex
                           flexDirection={'row'}
                           justifyContent={'space-between'}
                           alignItems={'center'}
                        >
                           <Button
                              borderRadius={99}
                              backgroundColor={'#ffb4b4'}
                              marginBottom={10}
                              marginRight={5}
                           >
                              <Text
                                 fontSize={16}
                                 paddingHorizontal={15}
                                 paddingVertical={5}
                                 color={'white'}
                                 fontWeight={'bold'}
                              >
                                 Update
                              </Text>
                           </Button>
                           <Button
                              onPress={async () => {
                                 await Database.deleteHike(idToManipulate);
                                 toast.show({
                                    description: '',
                                    duration: 800,
                                    render: () => {
                                       return (
                                          <Box
                                             bg='red.500'
                                             px='3'
                                             py='2'
                                             rounded='sm'
                                             mb={5}
                                          >
                                             <Text
                                                fontWeight={'bold'}
                                                color={'white'}
                                             >
                                                Hike Deleted
                                             </Text>
                                          </Box>
                                       );
                                    },
                                 });
                                 setModalVisible(!modalVisible);
                                 const data = await Database.getListHike();
                                 setListHike(data);
                              }}
                              borderRadius={99}
                              backgroundColor={'#374b73'}
                              marginBottom={10}
                           >
                              <Text
                                 fontSize={16}
                                 paddingHorizontal={15}
                                 paddingVertical={5}
                                 color={'white'}
                                 fontWeight={'bold'}
                              >
                                 Delete
                              </Text>
                           </Button>
                        </Flex>
                     </View>
                  </View>
               </TouchableOpacity>
            </Modal>
         </View>
      </View>
   );
};
const styles = StyleSheet.create({
   container: {
      marginTop: 70,
      paddingHorizontal: 25,
      backgroundColor: 'white',
      height: Dimensions.get('window').height,
   },
   hike_container: {
      flex: 1,
      minWidth: 150,
      maxWidth: 350,
      minHeight: 150,
      borderRadius: 16,
      backgroundColor: '#fcfaf9',
      borderColor: '#374B73',
      borderWidth: 2,
      marginHorizontal: 7,
      marginVertical: 10,
      shadowColor: 'black',
      shadowOffset: { width: 2, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 2,
   },
   hike_content: {
      padding: 10,
   },
   centeredView: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 10,
      marginBottom: 60,
   },
   modalView: {
      margin: 20,
      backgroundColor: 'white',
      borderRadius: 6,
      paddingHorizontal: 60,
      paddingTop: 40,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: {
         width: 0,
         height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
   },
   flex: {
      display: 'flex',
   },
   button: {
      borderRadius: 20,
      padding: 10,
      elevation: 2,
   },
   buttonOpen: {
      backgroundColor: '#F194FF',
   },
   buttonClose: {
      backgroundColor: '#2196F3',
   },
   textStyle: {
      color: 'white',
      fontWeight: 'bold',
      textAlign: 'center',
   },
   overlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
   },
});
export default HomeScreen;

import React, { Component} from 'react';
import {StyleSheet, View, Text,TouchableOpacity} from 'react-native';
import { DrawerItems} from 'react-navigation-drawer'
import * as ImagePicker from 'expo-image-picker'
import {Avatar,Icon} from 'react-native-elements'
import {RFValue} from 'react-native-responsive-fontsize'
import firebase from 'firebase';
import db from '../config'

export default class CustomSideBarMenu extends Component{
  
  state={
    userId:firebase.auth().currentUser.email,
    image:'#',
    name:"",
    docId:""
  }
  selectPicture = async()=>{
    const {cancelled,uri} = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing:true,
      aspect:[4 ,3],
      quality:1
    })
    if(!cancelled){
      this.setState({image:uri})
      this.uploadImage(uri,this.state.userId)
    }
  }
  
  uploadImage = async(uri,imageName)=>{
    var response = await fetch(uri);
    var blob=await response.blob();
    var ref= firebase.storage().ref().child("user_profiles/"+imageName);
    return ref.put(blob).then((response)=>{
      this.fetchImage(imageName)
    })
  }
  
  fetchImage=(imageName)=>{
    var storageref=firebase.storage().ref().child("user_profiles/"+imageName);
    storageref.getDownloadURL().then((url)=>{
      this.setState({image:url})
    }).catch((error)=>{
      this.setState({image:'#'})
    })
  }
  
  getUserProfile(){
    db.collection("users")
      .where("email_Id", "==", this.state.userId)
      .onSnapshot((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          this.setState({
            name: doc.data().first_name + " " + doc.data().last_name,
            docId: doc.id,
            image: doc.data().image,
          });
        });
      });
  }
  componentDidMount() {
    this.fetchImage(this.state.userId);
    this.getUserProfile();
  }
  
  render(){
    return(
      <View style={{flex:1}}>
      <View style={styles.avtaar}>
        <Avatar
          rounded
          source={{uri : this.state.image}}
          size = 'medium'
          onPress={()=>this.selectPicture()}
          containerStyle={styles.imageContainer}
                />
        <Text style={{ fontSize:20, fontWeight:'bold',paddingTop:20}}>{this.state.name}</Text>
      </View>
        <View style={styles.drawerItemsContainer}>
          <DrawerItems {...this.props}/>
        </View>
        <View style={{flex:0.1}}>
          <TouchableOpacity style={styles.logOutButton}
          onPress = {() => {
              this.props.navigation.navigate('WelcomeScreen')
              firebase.auth().signOut()
          }}>
            <Icon
              name="logout"
              type= 'antdesign'
              size={RFValue(20)}
              iconStyle={{paddingLeft:RFValue(10)}}
            />
            <Text style ={{fontSize:RFValue(15),
              fontWeight:"bold",
              marginLeft:RFValue(30)
            }}
            >Log Out</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}

var styles = StyleSheet.create({
  container : {
    flex:1
  },
  avtaar:{
    flex :0.5,
    alignItems: 'center',
    backgroundColor:'orange'
  },
  drawerItemsContainer:{
    flex:0.8,
    marginTop:100
  },
  logOutContainer : {
    flex:0.2,
    justifyContent:'flex-end',
    paddingBottom:30,
    marginBottom:100
  },
  logOutButton : {
    height:'100%',
    width:'100%',
    justifyContent:'center',
    padding:10,
    flexDirection:'row'
  },
  logOutText:{
    fontSize: 30,
    fontWeight:'bold'
  },
  imageContainer: {
    flex: 0.75,
    width: "40%",
    height: "20%",
    marginLeft: 20,
    marginTop: 30,
    borderRadius: 40,
  },
})
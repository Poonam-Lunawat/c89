import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
 } from 'react-native';
import{Card,Header,Icon} from 'react-native-elements';
import db from '../config'
import firebase from 'firebase'

export default class ReceiverDetailsScreen extends Component{
    constructor(props){
        super(props);
        this.state={
          userId          : firebase.auth().currentUser.email,
          userName        : "",
          receiverId      : this.props.navigation.getParam('details')["user_id"],
          requestId       : this.props.navigation.getParam('details')["request_id"],
          bookName        : this.props.navigation.getParam('details')["book_name"],
          reason_for_requesting     : this.props.navigation.getParam('details')["reason_to_request"],
          receiverName    : '',
          receiverContact : '',
          receiverAddress : '',
          receiverRequestDocId : ''
        }
      }

      getreceiverDetails(){
        db.collection('users').where('email_Id','==',this.state.receiverId).get()
        .then(snapshot=>{
          snapshot.forEach(doc=>{
            this.setState({
              receiverName    : doc.data().first_name,
              receiverContact : doc.data().contact,
              receiverAddress : doc.data().address,
            })
          })
        });
      
        db.collection('requested_books').where('request_id','==',this.state.requestId).get()
        .then(snapshot=>{
          snapshot.forEach(doc => {
            this.setState({receiverRequestDocId:doc.id})
         })
      })}

      updateBookStatus=()=>{
        db.collection('all_donations').add({
          book_name           : this.state.bookName,
          request_id          : this.state.requestId,
          requested_by        : this.state.receiverName,
          donor_id            : this.state.userId,
          request_status      :  "Donor Interested"
        })
      }
      

      addNotification=()=>{
        var message = this.state.userName + " has shown intrest in donating the book"
        db.collection("all_notifications").add({
          targeted_user_id  : this.state.receiverId,
          donor_id  : this.state.userId,
          request_id  : this.state.requestId,
          book_name  : this.state.bookName,
          date :  firebase.firestore.FieldValue.serverTimestamp(),
          notification_status:  "unread",
          message: message
        })
      }
      getUserDetails=(userId)=>{
        db.collection("users").where('email_Id','==', userId).get()
        .then((snapshot)=>{
          snapshot.forEach((doc) => {
            console.log("getUserDetails"+ doc.data())
            this.setState({
              userName  :doc.data().first_name + " " + doc.data().last_name
            })
          })
        })
      }
      
      componentDidMount(){
        this.getreceiverDetails()
        this.getUserDetails(this.state.userId)
      }
      
      
        render(){
          return(
            <View style={styles.container}>
              <View style={{flex:0.1}}>
                <Header
                  leftComponent ={<Icon name='arrow-left' type='feather' color='#696969'  onPress={() => this.props.navigation.goBack()}/>}
                  centerComponent={{ text:"Donate Books", style: { color: '#90A5A9', fontSize:20,fontWeight:"bold", } }}
                  backgroundColor = "#eaf8fe"
                />
               
              </View>
              <View style={{flex:0.3}}>
                <Card>
                <Card.Title>Book Information</Card.Title>
                  <Card >
                    <Text style={{fontWeight:'bold'}}>Name : {this.state.bookName}</Text>
                  </Card>
                  <Card>
                    <Text style={{fontWeight:'bold'}}>Reason : {this.state.reason_for_requesting}</Text>
                  </Card>
                </Card>
              </View>
              <View style={{flex:0.3}}>
                <Card >
                <Card.Title>Receiver Information</Card.Title>
                  
                  <Card>
                    <Text style={{fontWeight:'bold'}}>Name: {this.state.receiverName}</Text>
                  </Card>
                  <Card>
                    <Text style={{fontWeight:'bold'}}>Contact: {this.state.receiverContact}</Text>
                  </Card>
                  <Card>
                    <Text style={{fontWeight:'bold'}}>Address: {this.state.receiverAddress}</Text>
                  </Card>
                </Card>
              </View>
              {/* <View>
              <Text style = {{ fontSize : 30}}> Book Information</Text>
              <Text style={{fontWeight:'bold'}}>Name : {this.state.bookName}</Text>
              <Text style={{fontWeight:'bold'}}>Reason : {this.state.reason_for_requesting}</Text>
              <Text style = {{ fontSize: 30}}>Receiver Information</Text>
              <Text style={{fontWeight:'bold'}}>Name: {this.state.receiverName}</Text>
              <Text style={{fontWeight:'bold'}}>Contact: {this.state.receiverContact}</Text>
              <Text style={{fontWeight:'bold'}}>Address: {this.state.receiverAddress}</Text>

             
              </View> */}

              <View style={styles.buttonContainer}>
                {
                  this.state.receiverId !== this.state.userId
                  ?(
                    <TouchableOpacity
                        style={styles.button}
                        onPress={()=>{
                          this.updateBookStatus()
                          this.addNotification()
                          this.props.navigation.navigate('MyDonations')
                        }}>
                      <Text>I want to Donate</Text>
                    </TouchableOpacity>
                  )
                  : null
                }
              </View>
            </View>
          )
        }
      
      }
      
      
      const styles = StyleSheet.create({
        container: {
          flex:1,
        },
        buttonContainer : {
          flex:0.3,
          justifyContent:'center',
          alignItems:'center'
        },
        button:{
          width:200,
          height:50,
          justifyContent:'center',
          alignItems : 'center',
          borderRadius: 10,
          backgroundColor: 'orange',
          shadowColor: "#000",
          shadowOffset: {
             width: 0,
             height: 8
           },
          elevation : 16
        }
 })
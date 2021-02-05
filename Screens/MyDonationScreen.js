import React, { Component } from 'react'
import { View, Text, TouchableOpacity,Alert, ScrollView, FlatList, StyleSheet } from 'react-native';
import { Card, Icon, ListItem } from 'react-native-elements'
import MyHeader from '../Components/MyHeader.js'
import firebase from 'firebase';
import db from '../config.js'

export default class MyDonationScreen extends Component {
  static navigationOptions = { header: null };

  constructor() {
    super()
    this.state = {
      userId: firebase.auth().currentUser.email,
      bookName: "",
      allDonations: [],
      donorName: ""
    }
    this.requestRef = null
  }

  getDonorDetails = (donorId) => {
    db.collection("users").where("email_Id", "==", donorId).get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          this.setState({
            "donorName": doc.data().first_name + " " + doc.data().last_name
          })
        });
      })
  }
  getAllDonations =()=>{
    this.requestRef = db.collection("all_donations")
    .where("donor_id" ,'==', this.state.userId)
    .onSnapshot((snapshot)=>{
      var allDonations = []
      snapshot.docs.map((doc) =>{
        var donation = doc.data()
        donation["doc_id"] = doc.id
        allDonations.push(donation)
      });
      this.setState({
        allDonations : allDonations
      });
    })
  }
  

  sendBook = (bookDetails) => {
    
    if (bookDetails.request_status === "Book Sent") {
      var requestStatus = "already sent"
      db.collection("all_donations").doc(bookDetails.doc_id).update({
        "request_status": requestStatus
      })
     

      this.sendNotification(bookDetails, requestStatus)
    }
    else {
     if(bookDetails.request_status==="Donor Interested")
     { var requestStatus = "Book Sent"
      db.collection("all_donations").doc(bookDetails.doc_id).update({
        "request_status": requestStatus
      })
  
      this.sendNotification(bookDetails, requestStatus)
    }}
  }


  sendNotification = (bookDetails, requestStatus) => {
    var requestId = bookDetails.request_id
    var donorId = bookDetails.donor_id


    db.collection("all_notifications")
      .where("request_id", "==", requestId)
      .where("donor_id", "==", donorId)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          var message = ""
          if (requestStatus === "Book Sent") {
            message = this.state.donorName + " sent you book"
          } else {
            message = this.state.donorName + " has shown interest in donating the book"
          }
          db.collection("all_notifications").doc(doc.id).update({
            "message": message,
            "notification_status": "unread",
            "date": firebase.firestore.FieldValue.serverTimestamp()
          })
        });
      })
  }

  keyExtractor = (item, index) => index.toString()


  renderItem = ({ item, i }) => {
    return (
      <ListItem
        key={i} bottomDivider>
        <ListItem.Content>
          <ListItem.Title style={{ color: 'black', fontWeight: "bold" }}> {item.book_name}</ListItem.Title>
          <ListItem.Subtitle style={{ color: 'green' }}>Requested by: {item.requested_by}</ListItem.Subtitle>
          <ListItem.Subtitle style={{ color: 'green' }}>status: {item.request_status}</ListItem.Subtitle>

          <TouchableOpacity
            style={[
              styles.button,
              {
                backgroundColor: item.request_status === "Book Sent" ? "green" : "#ff5722"
              }
            ]}
            onPress={() => {
              {item.request_status==="Donor Interested"
              ?  (this.sendBook(item))
              : (Alert.alert (" book already sent"))
              }
             
            }}
          >
            <Text style={{ color: '#ffff' }}>{
              item.request_status === "Donor Interested" ? "Send Book" : "Book Sent"
            }</Text>
          </TouchableOpacity>
        </ListItem.Content>

      </ListItem>
    )
  }

  componentDidMount() {
    this.getAllDonations()
    this.getDonorDetails(this.state.userId)
  }

  componentWillUnmount() {
    this.requestRef();
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <MyHeader navigation={this.props.navigation} title="My Donations" />
        <View style={{ flex: 1 }}>
          {
            this.state.allDonations.length === 0
              ? (
                <View style={styles.subtitle}>
                  <Text style={{ fontSize: 20 }}>List of all book Donations</Text>
                </View>
              )
              : (
                <FlatList
                  keyExtractor={this.keyExtractor}
                  data={this.state.allDonations}
                  renderItem={this.renderItem}
                />
              )
          }
        </View>
      </View>
    )
  }
}


const styles = StyleSheet.create({
  button: {
    width: 100,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "#ff5722",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8
    },
    elevation: 16
  },
  subtitle: {
    flex: 1,
    fontSize: 20,
    justifyContent: 'center',
    alignItems: 'center'
  }
})
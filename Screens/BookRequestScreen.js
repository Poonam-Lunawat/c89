import React, { Component } from 'react';
import {
  View, SafeAreaView,
  Text,
  TextInput,
  KeyboardAvoidingView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  Image,
  
  
} from 'react-native';
import db from '../config';
import firebase from 'firebase';
import MyHeader from '../Components/MyHeader'
import { BookSearch } from 'react-native-google-books'
import { FlatList, TouchableHighlight } from 'react-native-gesture-handler';
import { ListItem, Avatar } from 'react-native-elements';

export default class BookRequestScreen extends Component {
  constructor() {
    super();
    this.state = {
      userId: firebase.auth().currentUser.email,
      bookName: "",
      reasonToRequest: "",

      isBookRequestActive: "",
      requestedBookName: "",
      bookStatus: "",
      requestId: "",
      userDocId: "",
      docId: "",
      //new states
      image_link: "",
      dataSource: "",
      showFlatlist: false,
      requestStatus:""

    }
  }

  createUniqueId() {
    return Math.random().toString(36).substring(7);
  }


 getRequestStatus=()=>{
   db.collection("all_donations").where("book_name",'==',this.state.bookName)
   .onSnapshot(query => {

    query.forEach((doc) => {
      this.setState({
        requestStatus:doc.data().request_status,
      })

    })
  })
  //  .then((snapshot) => {
  //   snapshot.forEach((doc) => {
  //       this.setState({
          
  //         requestStatus:doc.data().request_status,
  //       })
      

  //   })
  // })
  
  console.log(this.state.bookName)
  console.log(this.state.requestStatus)
 }
  addRequest = async (bookName, reasonToRequest) => {
    var userId = this.state.userId
    var randomRequestId = this.createUniqueId()
    //new lines 47,48
    var books = await BookSearch.searchbook(bookName, 'AIzaSyBNbOk70ccPT3tUW0WrKXKi48HDMDKY4SM')
    
    db.collection('requested_books').add({
      "user_id": userId,
      "book_name": bookName,
      "reason_to_request": reasonToRequest,
      "request_id": randomRequestId,
      //new addition
      book_status: "requested",
      date: firebase.firestore.FieldValue.serverTimestamp(),
      //new
      image_link: books.data[0].volumeInfo.imageLinks.smallThumbnail
    })
    //new code
    await this.getBookRequest()
    db.collection('users').where("email_Id", "==", userId)
      .get().then((snapshot) => {
        snapshot.forEach((doc) => {
          db.collection('users').doc(doc.id).update({
            isBookRequestActive: true
          })
        })
      })
    this.setState({
      bookName: '',
      reasonToRequest: '',
      request_id: randomRequestId  //new
    })

    return Alert.alert("Book Requested Successfully")
  }
  
  receivedBooks = (bookName) => {
    var userId = this.state.userId
    var requestId = this.state.requestId
    db.collection('received_books').add({
      user_id: userId,
      book_name: bookName,
      request_id: requestId,
      bookStatus: "received"
    })
  }
 

  getIsBookRequestActive() {
    db.collection('users')
      .where("email_Id", "==", this.state.userId)
      .onSnapshot(query => {

        query.forEach((doc) => {
          this.setState({
            isBookRequestActive: doc.data().isBookRequestActive,
            userDocId: doc.id
          })

        })
      })
  }

 
  getBookRequest = () => {
    var bookRequest = db.collection('requested_books')
      .where('user_id', "==", this.state.userId)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          if (doc.data().book_status !== "received") {
            this.setState({
              requestId: doc.data().request_id,
              requestedBookName: doc.data().book_name,
              bookStatus: doc.data().book_status,
              docId: doc.id
            })
          }

        })
      })
     
  }

  sendNotification = () => {
    db.collection('users').where('email_Id', '==', this.state.userId).get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          var name = doc.data().first_name
          var lastName = doc.data().last_name
          
          // to get the donor id and book name
          db.collection('all_notifications').where('request_id', '==', this.state.requestId).get()
            .then((snapshot) => {
              snapshot.forEach((doc) => {
                var donorId = doc.data().donor_id
                var bookName = doc.data().book_name
                
                //targert user id is the donor id to send notification to the user
                db.collection('all_notifications').add({
                  "targeted_user_id": donorId,
                  "message": name + " " + lastName + " received the book " + bookName,
                  "notification_status": "unread",
                  "book_name": bookName
                })
              })
            })
        })
      })
  }

  componentDidMount() {
 
    this.getBookRequest()

    this.getIsBookRequestActive()
   

  }

  updateBookRequestStatus = () => {
    //updating the book status after receiving the book
    db.collection('requested_books').doc(this.state.docId)
      .update({
        book_status: 'received'
      })

    //getting the  doc id to update the users doc
    db.collection('users').where('email_Id', '==', this.state.userId).get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          //updating the doc
          db.collection('users').doc(doc.id).update({
            isBookRequestActive: false
          })
        })
      })



  }

  //new c88
  async getBooksFromApi(bookName) {
    this.setState({ bookName: bookName })
    if (bookName.length > 2) {
      var books = await BookSearch.searchbook(bookName, 'AIzaSyBNbOk70ccPT3tUW0WrKXKi48HDMDKY4SM')
      this.setState({
        dataSource: books.data,
        showFlatlist: true
      })
    }
  }

  //new render for books api

  renderItem = ({ item, i }) => {
      return (
        <View>
       
      <TouchableHighlight 

      styles =
      {{
        alignItems:'center',
       backgroundColor:"#DDDDDD", 
       padding : 10, 
       width : '90%'
       }}
       activeOpacity={0.6}
        underlayColor="#DDDDDD"
        onPress={() => {
          this.setState({
            showFlatlist: false,
            bookName: item.volumeInfo.title,
            
          })
        }} bottomDivider
      >
      
    
        <Text>{item.volumeInfo.title}</Text>
       </TouchableHighlight>
       <Image style={{height:50, width:50}} source={{uri:item.image_link}}/>
       </View>
     )
  }
  render() {

    if (this.state.isBookRequestActive === true) {
      return (

        // Status screen

        <View style={{ flex: 1, justifyContent: 'center' }}>
          <View style={{ borderColor: "orange", borderWidth: 2, justifyContent: 'center', alignItems: 'center', padding: 10, margin: 10 }}>
            <Text>Book Name</Text>
            <Text>{this.state.requestedBookName}</Text>
          </View>
          <View style={{ borderColor: "orange", borderWidth: 2, justifyContent: 'center', alignItems: 'center', padding: 10, margin: 10 }}>
            <Text> Book Status : {this.state.bookStatus}</Text>


          </View>

          <TouchableOpacity style={{ borderWidth: 1, borderColor: 'orange', backgroundColor: "orange", width: 300, alignSelf: 'center', alignItems: 'center', height: 30, marginTop: 30 }}
            onPress={() => {
              if(this.state.requestStatus==="Book Sent"){
              this.sendNotification()
              this.updateBookRequestStatus();
              this.receivedBooks(this.state.requestedBookName)}
              else
             {
                Alert.alert("Book is not yet sent by any donor")
              }
            }}>
            <Text>I recieved the book </Text>
          </TouchableOpacity>
        </View>
      )
    }
    else {
      return (
        // Form screen
        <View style={{ flex: 1 }}>
          <MyHeader title="Request Book" navigation={this.props.navigation} />

          {/* <ScrollView> */}
          <View>
            {/* <KeyboardAvoidingView style={styles.keyBoardStyle}> */}
            <TextInput
              style={styles.formTextInput}
              placeholder={"enter book name"}
              onChangeText={text => this.getBooksFromApi(text)}
              onClear={text => this.getBooksFromApi('')}

              value={this.state.bookName}
            />

            {this.state.showFlatlist
              ? (<FlatList
              keyExtractor={(item, index) => index.toString()}
                data={this.state.dataSource}
                renderItem={this.renderItem}
                enableEmptySections={true}
                style={{ marginTop: 10 }}
                
              />
              )
              : (
                <View style={{ alignItems: 'center' }}>
                  <TextInput
                    style={[styles.formTextInput, { height: 300 }]}
                    multiline
                    numberOfLines={8}
                    placeholder={"Reason for requesting"}
                    onChangeText={(text) => {
                      this.setState({
                        reasonToRequest: text
                      })
                    }}
                    value={this.state.reasonToRequest}
                  />

                
                  <TouchableOpacity
                    style={styles.button}
                    onPress={() => { 
                      if(this.state.bookName!=="" && this.state.reasonToRequest.length>5) // both book name and reason should be added
                      {
                      this.addRequest(this.state.bookName, this.state.reasonToRequest)}
                      else{
                        Alert.alert("please enter details")
                      }
                    }}
                  >
                    <Text>Request</Text>
                  </TouchableOpacity>
                </View>
              )
            }



            {/* </KeyboardAvoidingView> */}
            {/* </ScrollView> */}
          </View>
        </View>
      )
    }
  }
}

const styles = StyleSheet.create({
  keyBoardStyle: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  formTextInput: {
    width: "75%",
    height: 35,
    alignSelf: 'center',
    borderColor: '#ffab91',
    borderRadius: 10,
    borderWidth: 1,
    marginTop: 20,
    padding: 10,
  },
  button: {
    width: "75%",
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: "#ff5722",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.44,
    shadowRadius: 10.32,
    elevation: 16,
    marginTop: 20
  },
}
)
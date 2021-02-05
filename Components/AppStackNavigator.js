import React from 'react';
import {createStackNavigator} from 'react-navigation-stack';
import BookDonateScreen from '../Screens/BookDonateScreen';
import ReceiverDetailsScreen from '../Screens/ReceiverDetailsScreen';


export const AppStackNavigator = createStackNavigator({
    BookDonateList :{
        screen : BookDonateScreen,
        navigationOptions:{
            headerShown:false
        }
    },
    ReceiverDetails:{
        screen:ReceiverDetailsScreen,
        navigationOptions:{
            headerShown:false
        }
    },
},
{
    initialRouteName:'BookDonateList'
}

);

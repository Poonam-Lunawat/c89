import React, { Component } from 'react'
import { Text, StyleSheet, View } from 'react-native'
import { createDrawerNavigator } from "react-navigation-drawer";
import { AppTabNavigator } from "./AppTabNavigator";
import CustomSideBarMenu from './CustomSideBarMenu';
import SettingScreen from '../Screens/SettingScreen'
import MyDonationScreen from '../Screens/MyDonationScreen'
import NotificationScreen from '../Screens/NotificationScreen'
import MyReceivedBooksScreen from '../Screens/MyReceivedBooksScreen';
import {Icon} from 'react-native-elements'

export const AppDrawerNavigator = createDrawerNavigator({
    Home: {
        screen: AppTabNavigator,
        navigationOptions:{
            drawerIcon:<Icon name="home" type='fontawesome5'/>
        }
    },
    MyDonations: {
        screen: MyDonationScreen,
        navigationOptions:{
            drawerIcon:<Icon name="book" type='font-awesome'/>,
            drawerLabel: "My Donations"
        }
    },

    Notifications: {
        screen: NotificationScreen,
        navigationOptions:{
            drawerIcon:<Icon name="bell" type='font-awesome'/>,
            drawerLabel: "Notifications"
        }
    },
    MyReceivedBooks :{
        screen: MyReceivedBooksScreen,
        navigationOptions:{
            drawerIcon:<Icon name="gift" type='font-awesome'/>,
            drawerLabel: "My Received Books"
        }
      },
    Settings: {
        screen: SettingScreen,
        navigationOptions:{
            drawerIcon:<Icon name="settings" type='fontawesome'/>,
            drawerLabel: "Settings"
        }
    },
},
    {
        contentComponent: CustomSideBarMenu
    },
    {
        initialRouteName: 'Home'
    }
)

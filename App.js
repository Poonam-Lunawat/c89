import * as React from 'react';
import {createAppContainer, createSwitchNavigator} from 'react-navigation'
import WelcomeScreen from './Screens/WelcomeScreen'
import {AppTabNavigator} from './Components/AppTabNavigator'
import {AppDrawerNavigator} from './Components/AppDrawerNavigator'
import { LogBox} from 'react-native';
import _ from 'lodash';

LogBox.ignoreAllLogs();
const _console = _.clone(console);
console.warn = message => {
  if (message.indexOf('Setting a timer') <= -1) {
    _console.warn(message);
  }
};
LogBox.ignoreLogs(["setting a timer"])
export default class App extends  React.Component{
  render(){
    return(
      <AppContainer/>
    )
  }
}

const switchNavigator = createSwitchNavigator({
  WelcomeScreen: {screen : WelcomeScreen},
  Drawer: { screen: AppDrawerNavigator},
  BottomTab: {screen : AppTabNavigator}
})

const AppContainer = createAppContainer(switchNavigator)
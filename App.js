import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet, Text, View } from 'react-native';
import { LiveChat } from './LiveChat';

const Tab = createBottomTabNavigator();

function Old() {
  return (
    <View style={styles.container}>
      <LiveChat old />
    </View>
  );
}

function New() {
  return (
    <View style={styles.container}>
      <LiveChat />
    </View>
  );
}

function MyTabs() {
  return (
    <Tab.Navigator
      initialRouteName="Old"
      tabBarOptions={{
        activeTintColor: '#e91e63',
      }}
    >
      <Tab.Screen
        name="Old"
        component={Old}
        unmountOnBlur
        options={{
          tabBarLabel: 'Old',
          tabBarIcon: () => (
            <Text>🍆</Text>
          ),
        }}
      />
      <Tab.Screen
        name="New"
        component={New}
        unmountOnBlur
        options={{
          tabBarLabel: 'New',
          tabBarIcon: () => (
            <Text>🎃</Text>
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <MyTabs />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

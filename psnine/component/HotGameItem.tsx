import React, { Component } from 'react'
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  TouchableNativeFeedback,
  InteractionManager,
  ActivityIndicator,
  StatusBar,
  Animated,
  Easing,
  FlatList,
  PanResponder,
  Modal,
  Keyboard,
  TouchableWithoutFeedback
} from 'react-native'

import { connect } from 'react-redux'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { standardColor, nodeColor, idColor, accentColor } from '../constant/colorConfig'

import { getHomeURL } from '../dao'

let screen = Dimensions.get('window')
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = screen

export default class PhotoItem extends React.PureComponent {

  shouldComponentUpdate = (props, state) => {
    if (props.modeInfo.themeName !== this.props.modeInfo.themeName) return true
    return false
  }

  onPress = () => {
    const { modeInfo, rowData, navigation } = this.props
    navigation.navigate('NewGame', {
      URL: `${rowData.href}?page=1`
    })
  }

  render() {
    let { modeInfo, rowData, navigation, width = ( SCREEN_WIDTH - 14 ) / 3 } = this.props
    width = width / modeInfo.numColumns
    return (
      <TouchableNativeFeedback
        useForeground={true}

        onPress={this.onPress}
        background={TouchableNativeFeedback.SelectableBackgroundBorderless()}
      >
        <View style={{
          flex: -1, flexDirection: 'row', backgroundColor: modeInfo.backgroundColor,
          alignSelf: 'flex-start',
          alignContent: 'flex-end',
          backgroundColor: modeInfo.backgroundColor,
          width: width,
          height: width
        }}>
          <Image
            source={{ uri: rowData.img || rowData.href }}
            style={[styles.avatar, { width: width, height: width }]}
          />
        </View>
      </TouchableNativeFeedback>
    )
  }

}

const styles = StyleSheet.create({
  avatar: {
    width: 150,
    height: 150
  }
})
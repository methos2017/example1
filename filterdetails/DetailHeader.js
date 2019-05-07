import React from 'react'
import { Dimensions, View, Image, StyleSheet, Text } from 'react-native'

export default class DetailHeader extends React.Component<Props, void> {
  render () {
    const screenWidth = Dimensions.get('window').width
    console.log('hello: ' + JSON.stringify(this.props))
    return (
      <View style={{ flexDirection: 'row', width: screenWidth }}>
        <View>
          <Image
            style={{ width: 132, height: 131 }}
            source={this.props.imageURL}
          />
        </View>

        <View style={styles.headerMain}>
          <Text style={styles.headerText}>{this.props.title}</Text>
          <Text style={styles.headerText2}>
            Установлен
            {'\n'} {this.props.date}
          </Text>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  headerText: {
    fontSize: 22,
    // fontWeight: 'bold',
    fontFamily: 'myriadProBold'
  },
  headerText2: { marginTop: 5, fontFamily: 'sfuiTextRegular' },
  headerMain: {
    borderWidth: 0,
    marginTop: 17,
    marginLeft: 16,
    marginRight: 33,
    flex: 1
  }
})

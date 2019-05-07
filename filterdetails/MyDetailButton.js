import React from 'react'
import {
  Dimensions,
  Text,
  View,
  TouchableHighlight,
  StyleSheet
} from 'react-native'

const screenWidth = Dimensions.get('window').width

export default class MyDetailButton extends React.Component<Props> {
  render () {
    const { navigation } = this.props
    const { prods } = this.props

    // console.log('Some in prods' + this.props.prods)

    return (
      <View
        style={{
          borderWidth: 0,
          width: screenWidth * 0.61 + 1 /* alignItems: 'center' */
        }}
      >
        <TouchableHighlight
          style={[
            styles.buttonContainer,
            {
              // width: screenWidth * 0.61
            }
          ]}
          onPress={() =>
            navigation.push('WebViewWork', {
              prods: prods,
              userData: this.props.userData,
              guid: this.props.guid
            })
          }
        >
          <Text style={styles.buttonStyles}>Заменить картридж!</Text>
        </TouchableHighlight>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  buttonContainer: {
    backgroundColor: '#0A417A',
    // borderRadius: 50,
    marginTop: 16,
    marginLeft: 15,
    marginBottom: 16
  },
  buttonStyles: {
    margin: 15,
    // borderRadius: 10,
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 19,
    fontFamily: 'myriadProBold'
  }
})

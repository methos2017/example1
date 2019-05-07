// @flow
import React from 'react'
import { FlatList, View } from 'react-native'
import MyDetailItem from './MyDetailItem.js'
import MyDetailButton from './MyDetailButton.js'

let globalCounter = 0

// this.state == 'news' ? this.functionName() : null

export default class MyDetailList extends React.Component<Props, void> {
  constructor () {
    super()
    this.changeIndicator = 0
  }
  myCallback = dataFromChild => {
    if (dataFromChild === 1 || dataFromChild === 2) {
      this.changeIndicator = 1
    }
  }

  renderItem = ({ item, navigation }: any) => {
    return (
      <MyDetailItem
        item={item}
        imageUrl={item.perspectivaFront}
        navigation={this.props.navigation}
        itemCount={globalCounter++}
        userData={this.props.userData}
        callbackFromParent={this.myCallback}
        // itemCount={globalCounter <= 3 ? globalCounter++ : (globalCounter = 0)}
      />
    )
  }
  keyExtractor = (item: any) => {
    return item.name
  }

  showButton = () => {
    if (this.changeIndicator === 1) {
      return (
        <MyDetailButton
          navigation={this.props.navigation}
          prods={this.props.data}
          userData={this.props.userData}
          guid={this.props.guid}
          // callbackFromParent={this.myCallback}
          // date={this.userData.date}
        />
      )
    }
  }

  render () {
    return (
      <View>
        <FlatList
          // data={[{ name: '1' }, { name: '2' }, { name: '3' }]}
          data={this.props.data.comp}
          keyExtractor={this.keyExtractor}
          renderItem={this.renderItem}
        />
        {this.showButton()}
      </View>
    )
  }
}

import React from 'react'
import { Image, View, StyleSheet, Text } from 'react-native'
import moment from 'moment'

import UniversalFunc from '../search/UniversalFunc.js'

import { images_comps } from '../../../images_comps.js'

let itemCount2 = 0

export default class MyDetailItem extends React.Component<Props, void> {
  constructor () {
    super()

    this.universalFunc = new UniversalFunc()
  }

  // const Days  = () => {
  //   return <Text>дней</Text>
  // }

  // parseDays = () => дней

  checkStatus = (showStyles, item, indicatorStyles, userData, finalDays) => {
    let daysLeft = item.resource[userData.nakip][userData.familyAmount]

    if (indicatorStyles === 0) {
      return (
        <Text style={[styles.rowForFilterText2, showStyles]}>
          {this.universalFunc.checkDays(finalDays)}
        </Text>
      )
    } else if (indicatorStyles === 1 || indicatorStyles === 2) {
      return (
        <Text style={[styles.rowForFilterText2, showStyles]}>
          {/* Осталось {item.daysUntilEmpty} дней */}
          Замена просрочена на: {this.universalFunc.checkDays(finalDays)}
        </Text>
      )
    }
  }

  render () {
    const { item, imageUrl } = this.props
    let { itemCount, userData } = this.props

    if (this.props.userData.nakip === undefined) {
      userData = { nakip: 0, familyAmount: 1 }
    }

    if (!userData.date) {
      userData.date = moment().unix()
      // console.log('Working with date...' + userData.date)
    }

    //  this.universalFunc.getDays(userData.date)

    let finalDays =
      item.resource[userData.nakip][userData.familyAmount] -
      this.universalFunc.getDays(userData.date)

    if (itemCount !== 0 && itemCount2 < 2) {
      itemCount2++
    } else itemCount2 = 0

    let indicatorStyles = this.universalFunc.colorForStatus(
      finalDays,
      item.resource[userData.nakip][userData.familyAmount]
    )

    // определяем отображение кнопки - заменить фильтр
    this.props.callbackFromParent(indicatorStyles)

    let showStyles = ''
    if (indicatorStyles === 0) showStyles = styles.ok
    else if (indicatorStyles === 1) showStyles = styles.soon
    else if (indicatorStyles === 2) showStyles = styles.replace
    // this.props.

    return (
      <View style={styles.rowForFilter}>
        <View
          style={
            item.type === 'filtr'
              ? { width: 24, height: 110 }
              : { width: 40, height: 85 }
          }
        >
          <Image
            style={{
              // flex: 1,
              // alignSelf: 'stretch',
              flex: 1,
              width: null,
              height: null,
              resizeMode: 'contain'
              // height: 105
            }}
            source={
              images_comps[item.guid]
                ? images_comps[item.guid].comps
                : this.userData.type === 'filtr'
                  ? require('../../../assets/home/slice_filters.png')
                  : require('../../../assets/home/slice_pitcher.png')
            }
            // style={{ width: 18, height: 79 }}
          />
        </View>
        <View style={{ width: 210 }}>
          <Text style={styles.rowForFilterText}>{item.nameForView}</Text>
          {this.checkStatus(
            showStyles,
            item,
            indicatorStyles,
            userData,
            finalDays
          )}
          {/* <Text style={[styles.rowForFilterText2, showStyles]}> */}
          {/* {indicatorStyles === 0 ? дня : дней} */}
          {/* </Text> */}
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  rowForFilter: { flexDirection: 'row', marginTop: 28, marginLeft: 16 },
  rowForFilterText: {
    paddingLeft: 48,
    fontSize: 16,
    fontFamily: 'sfuiTextRegular'
  },
  rowForFilterText2: {
    paddingLeft: 48,
    fontSize: 14,
    fontFamily: 'sfuiTextRegular'
  },
  replace: {
    color: '#FF0000'
  },
  ok: {
    color: '#008000'
  },
  soon: {
    color: '#FFA500'
  }
})

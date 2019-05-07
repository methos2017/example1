import React from "react"
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  Image,
  NetInfo,
  Platform,
  RefreshControl,
  Text,
  View,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  Alert
} from "react-native"

import TimerMixin from "react-timer-mixin"

import {
  ActionSheetProvider,
  connectActionSheet
} from "@expo/react-native-action-sheet"

import { Font } from "expo"

import DetailHeader from "./DetailHeader.js"
import MyDetailList from "./MyDetailList.js"

import * as firebase from "firebase"
// import firebase from 'expo-firebase-app';

// import firebase from 'react-native-firebase'

import moment from "moment"

import UniversalFunc from "../search/UniversalFunc.js"

import Icon from "react-native-vector-icons/FontAwesome"

import { images_front } from "../../../images_front.js"

import UniversalAuth from "../func/UniversalAuth.js"

import mainStyles from "../../styles/Main.js"

import { addItem, Reset, ResetComplects } from "./actions.js"

import { PersistGate } from "redux-persist/integration/react"

// import { persistStore, persistReducer } from 'redux-persist'

const testMode = 1

const screenHeight = Dimensions.get("window").height
const screenWidth = Dimensions.get("window").width

const HEADER_MAX_HEIGHT = screenHeight * 0.32
const HEADER_MIN_HEIGHT = Platform.OS === "ios" ? 10 : 23
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBOMM1GsFSu09uFAaZA-orMi_zzeqMOkWk",
  authDomain: "waterfilter-f8277.firebaseapp.com",
  databaseURL: "https://waterfilter-f8277.firebaseio.com",
  projectId: "waterfilter-f8277",
  storageBucket: "waterfilter-f8277.appspot.com"
}

require("firebase/firestore")

const firestore = firebase.firestore()
const settings = { timestampsInSnapshots: true }

firestore.settings(settings)

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig)
}

export default class AppContainer extends React.Component<props, Void> {
  constructor(props) {
    super(props)

    this.props = props
  }
  static navigationOptions = ({ navigation, navigate }) => {
    // navigation.state.params.loading = true

    //  globals

    const { state } = navigation

    /*

      Ставим фильтр на параметры, что бы два раза не вызывать статус пользователя,
      тк navigationOptions стартует два раза

      1. Естественный путь
      2. Когда передаются параметры через componentDidMount

    */

    //  пользователь не авторизован
    this.authMode = 0

    //  формируем массив Options для authMode

    this.optionsAuth = ["Отмена", "Купить картриджи"]

    // this.optionsAuth = ['Отмена', 'Купить картриджи', 'Войти', 'Склад']

    this.optionsAuth = ["Отмена", "Купить картриджи", "Войти"]

    if (navigation.state.params && state.params.userAuth) {
      //  получаем авторизационный
      this.userEmail = state.params.userAuth.email

      //  пользователь авторизован соответственно
      this.authMode = 1

      this.optionsAuth = [
        "Отмена",
        "Купить картриджи",
        "Ваш логин: " + this.userEmail, // this.userEmail
        "Выйти"
      ]
      // let someResult = (async () => {
      // code goes here
      //   let resultStatus = await this.universalAuth.checkStatus()
      //   return resultStatus
      // })()
    }

    funcCanGoBack = () => false

    return {
      title: "Фильтр-система",

      headerStyle: {
        backgroundColor: "#00A7D6"
      },
      headerTitleStyle: {
        color: "white"
      },
      headerTintColor: "white",
      headerLeft: (
        <TouchableOpacity
          underlayColor={"transparent"}
          onPress={() => {
            navigation.push("Home")
          }}
        >
          <Text style={mainStyles.leftArrowText}>
            <Icon name="angle-left" size={38} color="white" />
          </Text>
        </TouchableOpacity>
      ),
      //   ввести переменную mode

      //  index 1 - войти
      //  index 2 - выйти

      headerRight:
        navigation.state.params && navigation.state.params.loading ? (
          <TouchableOpacity
            onPress={() => {
              // console.log('Welcome to userData ' + state.params.userData)
              state.params.actionSheet(
                // ActionSheetIOS.showActionSheetWithOptions(
                {
                  //  numeration 0-отмена, 1-купить картриджи, 2-Ваш логин/Войти, 3-Выйти
                  options: this.optionsAuth,
                  destructiveButtonIndex: 1,
                  cancelButtonIndex: 0
                },
                buttonIndex => {
                  if (buttonIndex === 1) {
                    let path = state.params.userData.altComp[0]
                      ? "Complects"
                      : "WebViewWork"

                    // if (state.params.userData.altComp[0]) {

                    // }

                    navigation.push(path, {
                      // prods: state.params.componentsData,
                      //  два случая, когда запрос к бд
                      userData: state.params.userData.comp
                        ? state.params.userData
                        : state.params.componentsData,
                      guid3: state.params.userData.localGuid,
                      mode: "FilterDetails"
                      // store
                    })
                  } else if (buttonIndex === 2 && !this.authMode) {
                    // console.log('The button 2 is pressed')
                    navigation.push("Login")
                  } else if (buttonIndex === 2 && this.authMode) {
                    // console.log('Welcome to auth mode')
                    navigation.push("Register", { mode: "modify" })
                  } else if (buttonIndex === 3 && this.authMode) {
                    // console.log('The button 3 is pressed third time')

                    firebase.auth().signOut()

                    navigation.push("FilterDetails", {
                      userData: state.params.userData,
                      guid: state.params.guid
                    })

                    // this.setState({ exitMenu: true })
                    // this.props.navigation.reload()
                  } else if (buttonIndex === 3 && !this.authMode) {
                    console.log("button 4 pressed")

                    navigation.push("ComplectsStore")
                  }
                }
              )
            }}
          >
            <Image
              style={{ width: 28, height: 26, marginRight: 5 }}
              source={require("../../../assets/details/shopping_basket.png")}
            />
          </TouchableOpacity>
        ) : (
          <Text />
        )
    }
  }
  render() {
    console.log("Welcome to prerender screen with async some mode")

    //  запустить проверку

    return (
      <PersistGate persistor={persistor}>
        <ActionSheetProvider>
          <FilterDetails navigation={this.props.navigation} />
        </ActionSheetProvider>
      </PersistGate>
    )
  }
}

@connectActionSheet
class FilterDetails extends React.Component<props, Void> {
  constructor(props) {
    super(props)

    this.universalFunc = new UniversalFunc()

    this.universalAuth = new UniversalAuth()

    this.userData = {}

    let store = global.store
    // let persistor = global.persistor

    if (this.props.navigation.state.params) {
      this.userData = this.props.navigation.state.params.userData

      console.log("the local guid is " + this.userData.localGuid)

      console.log("the store is : " + JSON.stringify(store.getState()))

      // store.dispatch(Reset())
      // store.dispatch(ResetComplects())
    } else if (!this.userData.date) {
      this.userData.date = moment().unix()
      // console.log('Working with date...' + this.userData.date)
    }

    this.db = firebase.firestore()

    // this.db.enablePersistence({experimentalTabSynchronization:true}).then(() => {
    //   console.log("Woohoo! Multi-Tab Persistence!");
    // })

    this.state = {
      userDataName: this.userData ? this.userData.name : false,
      data: 0,
      loading: !!this.userData.comp,
      imageURL: require("../../../assets/details/header-details.png"),
      refreshing: false,
      scrollY: new Animated.Value(
        // iOS has negative initial scroll value because content inset...
        Platform.OS === "ios" ? -HEADER_MAX_HEIGHT : 0
      ),
      dbStatus: ""
    }
  }

  checkDbStatus = () => {
    // console.log('The db status is: ' + this.state.dbStatus)

    if (this.state.dbStatus !== "connected") {
      // alert('Подключение с базой данных истекло')
    }
  }

  handleFirstConnectivityChange(isConnected) {
    this.setState({ netStatus: isConnected ? "online" : "offline" })

    if (!sConnected) {
      // do action
    }
    NetInfo.isConnected.removeEventListener(
      "change",
      handleFirstConnectivityChange
    )
  }

  async handleConnectivityChange(status) {
    const { type } = status
    let probablyHasInternet
    try {
      const googleCall = await fetch("https://google.com", {
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
          Expires: 0
        }
      })
      probablyHasInternet = googleCall.status === 200

      // console.log(
      //   'im inside the hanndleConnectivityChange... la-la ' +
      //     probablyHasInternet
      // )

      // let netStatusVar = probablyHasInternet ? 'online' : 'offline'

      let netStatus = probablyHasInternet ? "online" : "offline"

      // await this.setState({ netStatus: netStatusVar })

      return netStatus
    } catch (e) {
      probablyHasInternet = false
    }

    console.log(`@@ isConnected: ${probablyHasInternet}`)
  }

  async componentDidMount() {
    // persistStore(this.props.store, {storage: Localforage}, () => {
    //   this.setState({ rehydrated: true })
    // })

    let store = global.store

    setTimeout(() => {
      store.dispatch(
        addItem(this.userData, this.userData.localGuid, "userData")
      )

      persistor
    }, 390)
    // persistor.flush()
    // persistor.persist()

    this._loadAssetsAsync()

    TimerMixin.setTimeout(() => this.checkDbStatus(), 1)

    const onInitialNetConnection = isConnected => {
      console.log(`Is initially connected: ${isConnected}`)

      NetInfo.isConnected.removeEventListener(onInitialNetConnection)
    }

    NetInfo.isConnected.addEventListener(
      "connectionChange",
      onInitialNetConnection
    )
    const didBlurSubscription = this.props.navigation.addListener(
      "didFocus",
      async payload => {
        // console.log('The screen focused')
        // console.debug('didBlur', payload);

        // both now work on the first call.
        await NetInfo.getConnectionInfo()
          .then(this.handleConnectivityChange)
          .then(async data => {
            if (!this.userData.comp) {
              console.log("comdata ?")
              await this.getFromDB(data)
              // else data = this.userData
            }
            let loading = true

            console.log("Welcome to dying second time " + loading)

            return loading
          })
          .then(async loading => {
            this.phoneId = await this.universalFunc.getGuid()

            console.log("phoneid")

            this.userAuth = await this.universalAuth.checkStatus()

            const { data } = this.state

            // TimerMixin.setTimeout(() => console.log('hello world'), 50)

            this.props.navigation.setParams({
              ...this.props.navigation,
              actionSheet: this.props.showActionSheetWithOptions,
              userAuth: this.userAuth,
              guid: this.guid,
              guid2: this.props.navigation.state.params.guid,
              componentsData: this.userData.comp || data,
              loading: loading,
              userData: this.userData,
              localGuid: this.userData.localGuid,
              db: this.db,
              phoneId: this.phoneId
            })
          })
      }
    )

    console.log("im inside component didmount " + this.netStatus)
  }

  async _loadAssetsAsync() {
    try {
      await Font.loadAsync({
        myriadProBold: require("../../../assets/fonts/MyriadPro-Bold.ttf"),
        sfuiTextRegular: require("../../../assets/fonts/SFUIText-Regular.otf")
      })
    } catch (e) {
      console.log(e)
    } finally {
      // console.log(Font.isLoaded('myriadProBold'))
      this.setState({ ready: true })
    }
  }

  _onOpenActionSheet = () => {
    // Same interface as https://facebook.github.io/react-native/docs/actionsheetios.html
    let options = ["Delete", "Save", "Cancel"]
    let destructiveButtonIndex = 0
    let cancelButtonIndex = 2
    this.props.showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
        destructiveButtonIndex
      },
      buttonIndex => {
        // Do something here depending on the button index selected
      }
    )
  }

  getMyDetailList = () => {
    const { loading, data } = this.state

    // console.log('the state data is' + this.state.loading)

    if (loading === false) {
      return <ActivityIndicator size="large" color="#0000ff" />
    } else if (loading === true) {
      // console.log('Say, hello: all loading is complete' + loading)

      // console.log('data comp: ' + JSON.stringify(data))
      return (
        // <View>
        <MyDetailList
          loading={loading}
          data={this.userData.comp ? this.userData : data}
          guid={this.guid}
          userData={this.userData}
          navigation={this.props.navigation}
        />
        // </View>
      )
    }
  }

  getFromDB = async netStatus => {
    this.setState({
      ...this.state
    })

    let guid = ""

    if (this.props.navigation.state.params) {
      this.guid = guid = this.props.navigation.state.params.guid.toString()
    } else {
      this.guid = guid = "344319ea-f0db-11e5-a00b-f4ce46b68263"
    }

    if (
      netStatus ===
      "online" /* this.state.netStatus || Constants.isDevice === false */
    ) {
      await this.db
        .collection("products7")
        .where("guid", "==", guid)
        .get()
        .then(querySnapshot => {
          const products = querySnapshot.docs.map(doc => {
            const data = doc.data()

            return data
          })

          this.componentsData = products

          return products[0]
        })
        .then(products => {
          this.setState({
            data: products,
            loading: true,
            dbStatus: "connected"
          })
        })
        .catch(error => {
          console.log(error)
          this.setState({
            ...this.state,
            loading: false
          })
        })
    } else {
      Alert.alert(
        "Мы не можем соединиться с базой данных. Причина - отстутсвие соединение с Интернет"
      )
    }
  }

  getHeader() {
    const { data } = this.state

    if (data === null) {
      return <ActivityIndicator size="large" color="#0000ff" />
    } else {
      console.log("the date is in getHeader" + JSON.stringify(this.userData))

      return (
        <DetailHeader
          imageURL={
            this.userData &&
            images_front[this.userData.guid] &&
            images_front[this.userData.guid].front
              ? images_front[this.userData.guid].front
              : this.userData.type === "filtr"
              ? require("../../../assets/home/slice_filters.png")
              : require("../../../assets/home/slice_pitcher.png")
          }
          imageType="uri"
          title={data[0].fatherName}
          date={moment.unix(this.userData.date).format("DD.MM.YYYY")}
        />
      )
    }
  }

  render() {
    const { data } = this.state

    const scrollY = Animated.add(
      this.state.scrollY,
      Platform.OS === "ios" ? HEADER_MAX_HEIGHT : 0
    )
    const headerTranslate = scrollY.interpolate({
      inputRange: [0, HEADER_SCROLL_DISTANCE],
      outputRange: [0, -HEADER_SCROLL_DISTANCE],
      extrapolate: "clamp"
    })

    const imageOpacity = scrollY.interpolate({
      inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
      outputRange: [1, 1, 0],
      extrapolate: "clamp"
    })
    const imageTranslate = scrollY.interpolate({
      inputRange: [0, HEADER_SCROLL_DISTANCE],
      outputRange: [0, 100],
      extrapolate: "clamp"
    })

    if (this.state.ready) {
      return (
        <View style={[styles.fill, { backgroundColor: "white" }]}>
          <StatusBar
            translucent
            barStyle="light-content"
            backgroundColor="rgba(0, 0, 0, 0.251)"
          />
          <Animated.ScrollView
            style={[styles.fill, { borderWidth: 0 }]}
            scrollEventThrottle={1}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { y: this.state.scrollY } } }],
              { useNativeDriver: true }
            )}
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={() => {
                  this.setState({ refreshing: true })
                  setTimeout(() => this.setState({ refreshing: false }), 1000)
                }}
                // Android offset for RefreshControl
                progressViewOffset={HEADER_MAX_HEIGHT}
              />
            }
            // iOS offset for RefreshControl
            contentInset={{
              top: HEADER_MAX_HEIGHT
            }}
            contentOffset={{
              y: -HEADER_MAX_HEIGHT
            }}
          >
            <View style={styles.scrollViewContent}>
              {this.getMyDetailList()}
            </View>
          </Animated.ScrollView>
          <Animated.View
            pointerEvents="none"
            style={[
              styles.header,
              {
                transform: [{ translateY: headerTranslate }],
                flexDirection: "row",
                borderWidth: 0
              }
            ]}
          >
            <View
              style={{
                width: screenWidth * 0.61,
                borderWidth: 0,
                flex: 1
              }}
            >
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  flex: 0.61,
                  marginTop: 10,
                  marginBottom: 10,
                  width: screenWidth * 0.61,
                  borderWidth: 0
                }}
              >
                <Animated.Image
                  style={[
                    styles.backgroundImage,
                    {
                      width: 120,
                      height: 127,
                      opacity: imageOpacity,
                      transform: [{ translateY: imageTranslate }]
                    }
                  ]}
                  source={
                    this.userData &&
                    images_front[this.userData.guid] &&
                    images_front[this.userData.guid].front
                      ? images_front[this.userData.guid].front
                      : this.userData.type === "filtr"
                      ? require("../../../assets/home/slice_filters.png")
                      : require("../../../assets/home/slice_pitcher.png")
                  }
                />
              </View>
              <View
                style={{
                  borderWidth: 0,
                  height: 100,
                  flex: 0.39,
                  justifyContent: "center"
                }}
              >
                <Text style={styles.topText}>
                  {this.state.userDataName
                    ? this.state.userDataName.toString()
                    : false}
                </Text>
              </View>
            </View>

            <View
              style={{
                width: screenWidth * 0.39
              }}
            >
              <Text style={styles.topText}>
                {moment.unix(this.userData.date).format("DD.MM.YYYY")}
              </Text>
            </View>
          </Animated.View>
        </View>
      )
    }
    return null
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "transparent"
  },

  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: "#ebf2f4",
    overflow: "hidden",
    height: HEADER_MAX_HEIGHT
  },
  cardContainer: {
    backgroundColor: "white",
    borderRadius: 12,
    paddingTop: 20,
    paddingLeft: 18
  },
  textHeader1: {
    fontSize: 20,
    fontWeight: "bold",
    fontFamily: "myriadProBold"
  },
  rowForFilter: { flexDirection: "row", marginTop: 28, marginLeft: 16 },
  rowForFilterText: {
    paddingLeft: 48,
    fontSize: 16,
    fontFamily: "sfuiTextRegular"
  },
  rowForFilterText2: {
    paddingLeft: 48,
    fontSize: 14,
    fontFamily: "sfuiTextRegular"
  },
  itemOptions: {
    paddingRight: 14,
    paddingLeft: 14,
    paddingTop: 0,
    paddingBottom: 14,
    color: "white",
    fontSize: 24
  },
  /* new */
  backgroundImage: {
    position: "absolute"
  },
  fill: {
    flex: 1,
    marginTop: 0
  },
  scrollViewContent: {
    // iOS uses content inset, which acts like padding.
    marginTop: 15,
    paddingTop: Platform.OS !== "ios" ? HEADER_MAX_HEIGHT : 0
  },
  topText: {
    backgroundColor: "#009dd0",
    color: "white",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
    padding: 10
  }
})

import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ListView,
  Image,
  DrawerLayoutAndroid,
  ToolbarAndroid,
  ToastAndroid,
  BackHandler,
  TouchableOpacity,
  Dimensions,
  TouchableNativeFeedback,
  RefreshControl,
  InteractionManager,
  Animated,
  Easing,
  PanResponder,
  TouchableHighlight,
  TouchableWithoutFeedback,
  StatusBar,
  Modal,
  Keyboard,
  AsyncStorage,
  ViewPagerAndroid,
  Platform,
  PixelRatio
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import MyDialog from '../component/Dialog'
import nativeImageSource from 'nativeImageSource';

import { connect } from 'react-redux';

import NewTopic from './new/NewTopic';

import { changeSegmentIndex, changeCommunityType, changeGeneType, changeCircleType } from '../redux/action/app';
import { getRecommend } from '../redux/action/recommend';

import { standardColor, accentColor } from '../constant/colorConfig';

import RightDrawer from './RightDrawer'
import TabContainer, { routes } from './Tab'

let screen = Dimensions.get('window');

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = screen;

const ACTUAL_SCREEN_HEIGHT = SCREEN_HEIGHT - StatusBar.currentHeight + 1;

let title = "PSNINE";
let isMounted = false;
let indexWithFloatButton = [0, 1, 3, 4];
let indexWithoutFloatButton = [2];

const searchAction = { title: '搜索', iconName: 'md-search', value: '', show: 'always' }

let recommendActions = [
  searchAction
]

let communityActions = [
  { title: '新建', iconName: 'md-create', value: '', show: 'always', iconSize: 22 },
  searchAction,
  { title: '全部', value: '', show: 'never' },
  { title: '新闻', value: 'news', show: 'never' },
  { title: '攻略', value: 'guide', show: 'never' },
  { title: '测评', value: 'review', show: 'never' },
  { title: '心得', value: 'exp', show: 'never' },
  { title: 'Plus', value: 'plus', show: 'never' },
  { title: '开箱', value: 'openbox', show: 'never' },
  { title: '游列', value: 'gamelist', show: 'never' },
  { title: '活动', value: 'event', show: 'never' }
];

let qaActions = [
  { title: '新建', iconName: 'md-create', value: '', show: 'always', iconSize: 22 },
  searchAction,
];

let gameActions = [
  searchAction,
];

let rankActions = [
  { title: '新建', iconName: 'md-create', value: '', show: 'always', iconSize: 22 },
  searchAction,
];

let battleActions = [
  { title: '新建', iconName: 'md-create', value: '', show: 'always', iconSize: 22 },
];

let geneActions = [
  { title: '新建', iconName: 'md-create', value: '', show: 'always', iconSize: 22 },
  searchAction
];

// let circleActions = [
//   searchAction,
//   { title: '全部', value: 'all', show: 'never' },
//   { title: '图文类', value: 'photo', show: 'never' },
//   { title: '音乐类', value: 'music', show: 'never' },
//   { title: '影视类', value: 'movie', show: 'never' },
//   { title: '视频类', value: 'video', show: 'never' },
// ]

let storeActions = [
  searchAction
]

let tradeActions = [
  { title: '新建', iconName: 'md-create', value: '', show: 'always', iconSize: 22 },
  searchAction
]

let toolbarActions = [
  recommendActions,
  communityActions,
  qaActions,
  geneActions,
  gameActions,
  battleActions,
  rankActions,
  /*circleActions,*/
  storeActions,
  tradeActions
]

let titlesArr = ["社区", "问答", "游戏", "约战", "机因"];

const ds = new ListView.DataSource({
  rowHasChanged: (row1, row2) => row1 !== row2,
});

let clamp = (value, min, max) => {
  return Math.min(Math.max(value, min), max);
};


let toolbarHeight = 56;
let releasedMarginTop = 0;
let config = { tension: 30, friction: 7, ease: Easing.in(Easing.ease(1, 0, 1, 1)), duration: 200 };
const timeout = 190
const delay = 50

import {
  ExtraDimensionsAndroid,
  AppBarLayoutAndroid,
  CoordinatorLayoutAndroid,
  NestedScrollViewAndroid,
  TabLayoutAndroid,
  PopupWindowAndroid
} from 'mao-rn-android-kit'

import NestedScrollView from 'react-native-nested-scrollview';

class Toolbar extends Component {

  constructor(props) {
    super(props);

    this.state = {
      search: '',
      rotation: new Animated.Value(1),
      scale: new Animated.Value(1),
      opacity: new Animated.Value(1),
      marginTop: new Animated.Value(0),
      openVal: new Animated.Value(0),
      innerMarginTop: new Animated.Value(0),
      modalVisible: false,
      modalOpenVal: new Animated.Value(0),
      topicMarginTop: new Animated.Value(0),
      tabMode: this.props.modeInfo.settingInfo.tabMode,
      _scrollHeight: this.props.modeInfo.height - StatusBar.currentHeight - 38 + 1
      // _scrollHeight: 
    }
  }

  searchMapper = Object.keys(routes).reduce((prev, curr) => (prev[curr] = '', prev), {})
  afterEachHooks = []

  componentWillMount = () => {
    this.props.dispatch(getRecommend())
    this._pages.length = 0;
  }


  componentWillReceiveProps(nextProps) {
    // this.props.app = 
    // console.log('??? receving', nextProps.app.segmentedIndex, this.props.app.segmentedIndex)
    if (this.state.tabMode !== nextProps.modeInfo.settingInfo.tabMode) {
      this.setState({
        tabMode: nextProps.modeInfo.settingInfo.tabMode
      })
    } else if (this.props.modeInfo.width !== nextProps.modeInfo.width) {
      this.setState({
        _scrollHeight: nextProps.modeInfo.height - StatusBar.currentHeight - 38 + 1
      })
    }
  }

  _onSearch = (text) => {
    this.setState({
      search: text
    })
    const currentIndex = this.props.app.segmentedIndex
    const callback = this.afterEachHooks[currentIndex]
    typeof callback === 'function' && callback(text)
    const currentRouteName = Object.keys(routes)[currentIndex]
    this.searchMapper[currentRouteName] = this.state.search
  }

  _onSearchClicked = () => {
    this.props.navigation.navigate('Search', {
      shouldSeeBackground: true,
      content: this.state.search,
      callback: this._onSearch
    })
  }

  onActionSelected = (index) => {
    const { segmentedIndex, communityType } = this.props.app;
    // console.log(segmentedIndex)
    const { dispatch } = this.props;
    if (segmentedIndex === 1) {
      if (index !== 0 && index !== 1) {
        let type = toolbarActions[segmentedIndex][index].value;
        dispatch(changeCommunityType(type));
      } else {
        index === 1 && this._onSearchClicked()
        const obj = {}
        if (communityType) {
          obj.URL = `http://psnine.com/node/${communityType}/add`
        }
        index === 0 && this.props.navigation.navigate('NewTopic', obj)
      }
    } else if (segmentedIndex === 2) {
      index === 0 && this.props.navigation.navigate('NewQa', {})
      index === 1 && this._onSearchClicked()
    } else if (segmentedIndex === 3) {
      if (index !== 0 && index !== 1) {
        let type = toolbarActions[segmentedIndex][index].value;
        dispatch(changeGeneType(type));
      } else {
        index === 1 && this._onSearchClicked()
        index === 0 && this.props.navigation.navigate('NewGene', {})
      }
    } else if (segmentedIndex === 5) {
      this.props.navigation.navigate('NewBattle', {})
    } else if (segmentedIndex === 8) {
      index === 0 && this.props.navigation.navigate('NewTrade', {})
      index === 1 && this._onSearchClicked()
    } else {
      this._onSearchClicked()
    }
  }

  render() {
    const { app: appReducer, switchModeOnRoot, modeInfo } = this.props;
    const { segmentedIndex } = this.props.app;
    const { openVal } = this.state
    const tipHeight = toolbarHeight * 0.8
    log(modeInfo.themeName, '====> Toolbar inner')
    // alert(appReducer.segmentedIndex)
    return (
      <View style={{ flex: 1 }}>
        <CoordinatorLayoutAndroid
          fitsSystemWindows={false}
          ref={this._setCoordinatorLayout}>

          <AppBarLayoutAndroid
            ref={this._setAppBarLayout}
            layoutParams={{
              height: 94 // required
            }}
            style={styles.appbar} >
            <View
              style={styles.navbar}
              layoutParams={{
                height: 56, // required
                scrollFlags: (
                  AppBarLayoutAndroid.SCROLL_FLAG_SCROLL |
                  AppBarLayoutAndroid.SCROLL_FLAG_ENTRY_ALWAYS
                )
              }}>
              <View style={styles.toolbar}>
                <Icon.ToolbarAndroid
                  navIconName="md-menu"
                  style={[styles.toolbar, { backgroundColor: modeInfo.standardColor, elevation: 0 }]}
                  overflowIconName="md-more"
                  iconColor={modeInfo.isNightMode ? '#000' : '#fff'}
                  actions={toolbarActions[appReducer.segmentedIndex]}
                  key={appReducer.segmentedIndex}
                  onActionSelected={this.onActionSelected}
                  onIconClicked={this.props._callDrawer()}
                >
                  <TouchableWithoutFeedback>
                    <View style={{ height: 56, flex: 1, flexDirection: 'column', justifyContent: 'center' }}>
                      <Text style={{ fontSize: 20, fontWeight: '300', color: modeInfo.isNightMode ? '#000' : '#fff' }} onPress={() => {
                        const index = this._currentViewPagerPageIndex
                        const callback = this.afterEachHooks[index]
                        {/*log(callback, this.state.afterEachHooks, index)*/ }
                        typeof callback === 'function' && callback()
                      }}>
                        {title}
                      </Text>
                      {this.state.search && <Text
                        onPress={() => {
                          this._onSearch('')
                        }}
                        style={{ fontSize: 15, color: modeInfo.isNightMode ? '#000' : '#fff' }}>
                        {`当前搜索: ${this.state.search}`}
                      </Text> || undefined}
                    </View>
                  </TouchableWithoutFeedback>
                </Icon.ToolbarAndroid>
              </View>
              <View style={styles.actionBar}>
              </View>
            </View>
            <View
              style={styles.tabBar}>
              <TabLayoutAndroid
                tabMode="scrollable"
                tabSelectedTextColor="#fff"
                tabIndicatorColor="#fff"
                tabTextColor="rgba(255, 255, 255, .6)"
                tabIndicatorHeight={2}

                tabSidePadding={22}
                tabGravity='center'
                tabHeight={38}
                ref={this._setTabLayout}
                style={{
                  backgroundColor: modeInfo.standardColor
                }} />
            </View>
          </AppBarLayoutAndroid>

          <View
            style={[styles.scrollView, { height: this.state._scrollHeight }]}
            ref={this._setScrollView}>
            <ViewPagerAndroid
              onPageScroll={this._handleViewPagerPageScroll}
              onPageScrollStateChanged={this._handleViewPagerPageScrollStateChanged}
              onPageSelected={this._handleViewPagerPageSelected}
              style={[styles.viewPager, { height: this.state._scrollHeight }]}
              initialPage={this._currentViewPagerPageIndex}
              ref={this._setViewPager}>
              {this._getPages({
                height: this.state._scrollHeight,
                initialPage: this._currentViewPagerPageIndex
              })}
            </ViewPagerAndroid>
          </View>
        </CoordinatorLayoutAndroid>
        <PopupWindowAndroid
          ref={this._setMenuPopup}>
          <View style={styles.menu}>
          </View>
        </PopupWindowAndroid>
      </View>
    );
  }

  _tabTexts = Object.keys(routes).map(name => ({ text: routes[name].screen.navigationOptions.tabBarLabel }))

  _coordinatorLayout = null;
  _appBarLayout = null;
  _scrollView = null;
  _viewPager = null;
  _menuPopup = null;
  _menuBtn = null;
  _tabLayout = null;
  _pages = [];
  _currentViewPagerPageIndex = 0;


  _handleMenuButtonPess = () => {
    this._menuPopup.showAsDropdown(this._menuBtn, 0, -10);
  }

  _setMenuBtn = component => {
    this._menuBtn = component
  }

  _handleMenuItemPress = () => {
    this._menuPopup.hide();
  }

  _setMenuPopup = component => {
    this._menuPopup = component;
  }

  _setCoordinatorLayout = component => {
    this._coordinatorLayout = component;
  };

  _setAppBarLayout = component => {
    this._appBarLayout = component;
  };

  _setTabLayout = component => {
    this._tabLayout = component;
  }

  _setScrollView = component => {
    this._scrollView = component;
  }

  _setViewPager = component => {
    this._viewPager = component;
  }

  _addPage = component => {
    this._pages.push(component);
  }

  _handleViewPagerPageScroll = event => {
    let nativeEvent = event.nativeEvent;
    let offset = nativeEvent.offset;

    if (offset >= 0.60) {
      this._currentViewPagerPageIndex = nativeEvent.position + 1;
    } else {
      this._currentViewPagerPageIndex = nativeEvent.position
    }
  }

  _handleViewPagerPageScrollStateChanged = scrollState => {
    if (scrollState === 'settling') {
      this._loadPage(this._currentViewPagerPageIndex);
    }
  }

  _handleViewPagerPageSelected = event => {
    let nativeEvent = event.nativeEvent;
    this._loadPage(nativeEvent.position);
  }

  _loadPage(index) {
    let page = this.refs['page_' + index];
    if (page && !page.isLoaded()) {
      page.load();

    }
    if (index !== this.props.app.segmentedIndex) {
      this.props.dispatch(changeSegmentIndex(index))
      setTimeout(() => {
        const callback = this.afterEachHooks[index]
        const currentRouteName = Object.keys(routes)[index]
        if (this.searchMapper[currentRouteName] !== this.state.search) {
          typeof callback === 'function' && callback(this.state.search)
          this.searchMapper[currentRouteName] = this.state.search
        }
      })
    }
  }

  _getPages({ height, initialPage = 1 }) {
    const { modeInfo } = this.props
    return this._tabTexts.map((tab, index) => {
      return (
        <View
          key={index}
          style={{ backgroundColor: modeInfo.background }}>
          <Page
            ref={'page_' + index}
            tab={tab}
            pageIndex={index}
            index={index}
            height={height}
            initialPage={initialPage}
            screenProps={{
              communityType: this.props.app.communityType,
              geneType: this.props.app.geneType,
              circleType: this.props.app.circleType,
              navigation: this.props.navigation,
              toolbarDispatch: this.props.dispatch,
              segmentedIndex: this.props.app.segmentedIndex,
              modeInfo: this.props.modeInfo,
              setMarginTop: this.setMarginTop,
              modalVisible: this.state.modalVisible,
              searchTitle: this.state.search,
              registerAfterEach: componentDidFocus => {
                const obj = {}
                if (componentDidFocus) {
                  const { index, handler } = componentDidFocus
                  this.afterEachHooks = [...this.afterEachHooks]
                  this.afterEachHooks[index] = handler
                }
              }
            }}
            navigation={{
              navigate: (name) => {
                if (name === 'Community') {
                  this._currentViewPagerPageIndex = 1
                  this._viewPager.setPage(1)
                  this._loadPage(1)
                }
              }
            }}
            key={index} />
        </View>
      )
    });
  }

  componentDidMount() {
    this._coordinatorLayout.setScrollingViewBehavior(this._scrollView)
    this._tabLayout.setViewPager(this._viewPager, this._tabTexts)
    this._viewPager.setPageWithoutAnimation(1)
    // this._viewPager.setViewSize
    this.refs['page_1'].load();
    this._currentViewPagerPageIndex = 1

    // this.props.navigation.navigate('Home', {
    //   title: 'secondlife_xhm',
    //   id: 'secondlife_xhm',
    //   URL: `http://psnine.com/psnid/${'secondlife_xhm'}`
    // })
  }


}

class Page extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loaded: false
    }
  }

  shouldComponentUpdate = (nextProps, nextState) => {
    if (nextProps.screenProps.segmentedIndex !== this.props.screenProps.segmentedIndex) {
      if (nextProps.screenProps.segmentedIndex === this.props.index) return true
      return false
    }
    return true
  }

  render() {
    let content = null;
    if (this.state.loaded) {
      content = this._getContent()
    } else {
      content = <View></View>
    }

    return content;
  }

  isLoaded() {
    return this.state.loaded;
  }

  load() {
    if (this.state.loaded) return

    this.state.loaded = true

    this.setState({
      loaded: true
    });
  }

  _getContent() {
    const Name = Object.keys(routes)[this.props.index]
    const TargetRoute = routes[Name]
    if (!TargetRoute) return null
    let Target = TargetRoute.screen
    let items = (
      <Target
        {...this.props}
      />
    )
    return items
    // return <NestedScrollViewAndroid showVerticalScrollIndicator={true} showsVerticalScrollIndicator={true}>{items}</NestedScrollViewAndroid>
  }
}

function mapStateToProps(state) {
  return {
    app: state.app,
  };
}


export default connect(
  mapStateToProps
)(Toolbar);


const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#F5FCFF',
  },
  toolbar: {
    backgroundColor: standardColor,
    height: toolbarHeight,
    elevation: 0,
  },
  segmentedView: {
    backgroundColor: '#F5FCFF',
  },
  selectedTitle: {
    //backgroundColor: '#00ffff'
    //fontSize: 20
  },
  appbar: {
    backgroundColor: "#2278F6"
  },

  avatar: {
    width: 50,
    height: 50,
  },
  navbar: {
    height: 56,
    // alignItems: "center",
    // justifyContent: "center",
    // backgroundColor: "transparent",
    // position: 'relative'
  },

  backBtn: {
    top: 0,
    left: 0,
    height: 56,
    position: 'absolute'
  },

  caption: {
    color: '#fff',
    fontSize: 20
  },

  actionBar: {
    position: 'absolute',
    top: 0,
    right: 0,
    height: 56,
    flexDirection: 'column',
    flexWrap: 'nowrap',
    justifyContent: 'center',
    paddingLeft: 10
  },

  actionBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },

  menuBtn: {
    width: 34,
    paddingRight: 10
  },

  menuBtnIcon: {
    width: 16,
    height: 16,
    tintColor: 'rgba(255, 255, 255, .8)'
  },


  menu: {
    width: 150,
    backgroundColor: 'rgba(0, 0, 0, 0.8)'
  },

  tabBar: {
    height: 38,
    backgroundColor: '#4889F1'
  },

  scrollView: {
    backgroundColor: "#f2f2f2"
  },

  viewPager: {
    flex: 1,
    backgroundColor: 'transparent'
  },

  pageItem: {
    borderRadius: 2,
    height: 200,
    marginLeft: 10,
    marginRight: 10,
    marginTop: 5,
    marginBottom: 5,
    justifyContent: 'center',
    alignItems: 'center'
  },

  pageItemContent: {
    fontSize: 30,
    color: '#FFF'
  }
});

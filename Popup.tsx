import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Animated,
  TouchableOpacity,
  BackHandler,
} from 'react-native';
const { width, height } = Dimensions.get('window');

type IOptions = {
  content: JSX.Element;
};
type Ishow = (options: IOptions, callback?: () => void) => void;

interface IProps {}
interface IState {
  show: boolean;
  animatedValue: Animated.Value;
  content: IOptions['content'];
}
class Popup extends Component<IProps, IState> {
  showAnimated: Animated.CompositeAnimation;
  hideAnimated: Animated.CompositeAnimation;
  static _this: any;

  constructor(props: any) {
    super(props);
    Popup._this = this;
    this.state = {
      show: false, //显示、隐藏
      animatedValue: new Animated.Value(0), //动画值
      content: <Text>无内容</Text>,
    };
    this.showAnimated = Animated.timing(this.state.animatedValue, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    });
    this.hideAnimated = Animated.timing(this.state.animatedValue, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    });
  }
  static show: Ishow = (options, callback) => {
    const content = options.content || <Text>无内容</Text>;

    Popup._this.setState({
      show: true,
      content,
      callback,
    });
    // 动画值初始化为0,并开始执行动画
    Popup._this.state.animatedValue.setValue(0);
    Popup._this.showAnimated.start();
  };
  static hide = () => {
    Popup._this.popupHide();
  };
  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.onBackPress);
  }
  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.onBackPress);
  }
  // 安卓返回键关闭APP
  onBackPress = () => {
    if (this.state.show) {
      this.popupHide();
      return true;
    } else {
      return false;
    }
  };
  popupHide = () => {
    // 动画值初始化为0
    this.state.animatedValue.setValue(1);
    // 开始执行动画
    this.hideAnimated.start(() => {
      // this.state.callback && this.state.callback({ confirm: true });
      this.setState({ show: false });
    });
  };
  render() {
    if (this.state.show) {
      const translateY = this.state.animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [height, 0],
      });
      return (
        <View style={styles.wrapper}>
          <TouchableOpacity style={styles.mask} activeOpacity={1} onPress={this.popupHide}>
            <View></View>
          </TouchableOpacity>
          <Animated.View
            style={[
              styles.content,
              {
                transform: [{ translateY: translateY }],
              },
            ]}
          >
            {this.state.content}
          </Animated.View>
        </View>
      );
    } else {
      return <View />;
    }
  }
}

export default Popup;

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: width,
    height: height,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 999,
  },
  mask: {
    position: 'absolute',
    left: 0,
    top: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    width: width,
    height: height,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    backgroundColor: '#FFF',
    // width: width * 0.75,
    // height: height * 0.75,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

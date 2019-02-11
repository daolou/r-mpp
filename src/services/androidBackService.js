import { androidBackEvent } from '../utils/NDB';

export default Component => {
  // console.log(Component.prototype)
  // console.log(Component.onAndroidBackClick)
  const originAndroidBackClick = Component.prototype.onAndroidBackClick;
  if (!originAndroidBackClick) {
    console.error(`onAndroidBack must be a function`);
    throw Error(`onAndroidBack must be a function`);
  }

  const originDidmount = Component.prototype.componentDidMount;
  Component.prototype.componentDidMount = function() {
    // console.log(originDidmount,Component.prototype)
    // console.log(Component.prototype,androidBackEvent)
    // console.log(Component.onAndroidBackClick)
    androidBackEvent.addEventListener((...args) => {
      console.log(this);
      Component.prototype.onAndroidBackClick.call(this, ...args);
    });
    if (originDidmount) {
      originDidmount.call(this, ...arguments);
    }
  };

  const originUnmount = Component.prototype.componentWillUnmount;
  // androidBackEvent.addEventListener(Component.prototype.onAndroidBackClick)
  Component.prototype.componentWillUnmount = function() {
    androidBackEvent.removeEventListener(Component.prototype.onAndroidBackClick);
    if (originUnmount) {
      originUnmount.call(this, ...arguments);
    }
  };
  return Component;
};

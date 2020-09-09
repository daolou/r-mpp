import React, { PureComponent } from 'react';
import ReactDOM from 'react-dom';
import NDB from '~src/utils/NDB';
import { css2obj } from '~src/utils/index';
import androidBackService from '~src/services/androidBackService';
import IMG from '../images/share-hi.png';
import Provider from '~src/components/Provider';
import Back from '~src/components/Back';
import Loading from '~src/components/Loading';
import Countdown from '~src/components/Countdown';
import API from '~api/index';
import classnames from 'classnames/bind';
import styles from './index.less';

const cx = classnames.bind(styles);
console.log(process.env.NODE_CONFIG_ENV, API);
@Provider
@androidBackService
class Index extends PureComponent {
  goBack = () => {
    NDB.run('closeWebView');
  };
  onAndroidBackClick() {
    // console.log(this);
    console.log('back clicked');
    console.log('webview: will close');
    this.goBack();
  }
  componentDidMount() {
    const str = `width:322px;
      height:338px;
      background:linear-gradient(180deg,rgba(223,186,248,0) 0%,rgba(187,132,238,1) 100%);`;
    console.log(css2obj(str));
    NDB.report('event', 'start', {
      event_category: 'index',
    });
  }
  render() {
    return (
      <div className={cx('index')} style={{ margin: '30px auto 0' }}>
        <div style={{ width: '60px', height: '60px' }}>
          <Back />
        </div>
        当前: 活动首页
        <br />
        <a href="./questions">去活动问题页</a>
        <Countdown status="start" initial_second={3600 * 3} />
        <div style={{ width: '60px', height: '60px' }}>
          <Loading color="#fff" />
        </div>
        <img src={IMG} alt="" />
      </div>
    );
  }
}

ReactDOM.render(<Index />, document.getElementById('root'));

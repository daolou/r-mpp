import React, { PureComponent } from 'react';
import ReactDOM from 'react-dom';
import NDB from '~src/utils/NDB';
import { css2obj } from '~src/utils/index';
import androidBackService from '~src/services/androidBackService';
import styles from './index.less';
import IMG from '../images/share-hi.png';
import Provider from '~src/components/Provider';
import API from '~api/index';

console.log(process.env.NODE_CONFIG_ENV, API);
@Provider
@androidBackService
class Index extends PureComponent {
  onAndroidBackClick() {
    // console.log(this);
    console.log('back clicked');
    console.log('webview: will close');
    NDB.run('closeWebView');
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
      <div className={styles['index']} style={{ margin: '30px auto 0' }}>
        当前: 活动首页
        <br />
        <a href="./questions">去活动问题页</a>
        <img src={IMG} alt="" />
      </div>
    );
  }
}

ReactDOM.render(<Index />, document.getElementById('root'));

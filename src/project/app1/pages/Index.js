import React, { PureComponent } from 'react';
import { Link } from 'react-router-dom';
import NDB from '../../../utils/NDB';
import { css2obj } from '../../../utils/index';
import androidBackService from '../../../services/androidBackService';
import paths from '~build/paths';

@androidBackService
export default class Index extends PureComponent {
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
      <div style={{ margin: '30px auto 0' }}>
        当前: 活动首页
        <br />
        <Link to={`${paths.public}questions`}>去活动问题页</Link>
      </div>
    );
  }
}

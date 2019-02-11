import React, { PureComponent } from 'react';
import { Link } from 'react-router-dom';
import NDB from '../../../utils/NDB';
import androidBackService from '../../../services/androidBackService';

@androidBackService
export default class Index extends PureComponent {
  onAndroidBackClick() {
    console.log(this);
    console.log('back clicked');
    console.log('webview: will close');
    NDB.run('closeWebView');
  }
  componentDidMount() {
    NDB.report('event', 'start', {
      event_category: 'index',
    });
  }
  render() {
    return (
      <div>
        当前: 活动首页
        <br />
        <Link to="/questions.html">去活动问题页</Link>
      </div>
    );
  }
}

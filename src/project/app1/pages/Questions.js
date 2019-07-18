import React, { PureComponent } from 'react';
import { Link } from 'react-router-dom';
import NDB from '../../../utils/NDB';
import androidBackService from '../../../services/androidBackService';
import paths from '~build/paths';

@androidBackService
export default class Questions extends PureComponent {
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
    console.log(this.props);
    return (
      <div>
        当前: 活动问题页
        <br />
        <Link to={`${paths.public}index`}>去活动首页</Link>
      </div>
    );
  }
}

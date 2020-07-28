import React, { PureComponent } from 'react';
import ReactDOM from 'react-dom';
import NDB from '~src/utils/NDB';
import androidBackService from '~src/services/androidBackService';

@androidBackService
class Questions extends PureComponent {
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
      </div>
    );
  }
}

ReactDOM.render(<Questions />, document.getElementById('root'));

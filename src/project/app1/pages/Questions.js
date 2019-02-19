import React, { PureComponent } from 'react';
import { Link } from 'react-router-dom';

export default class Questions extends PureComponent {
  render() {
    console.log(this.props);
    return (
      <div>
        当前: 活动问题页
        <br />
        <Link to="/index.html">去活动首页</Link>
      </div>
    );
  }
}

import React from 'react';
import { Link } from 'react-router-dom';

const Questions = () => (
  <div>
    当前: 活动问题页
    <br />
    <Link to="/index.html">去活动首页</Link>
  </div>
);

Questions.displayName = 'Questions';
export default Questions;

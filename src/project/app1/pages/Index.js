import React from 'react';
import { Link } from 'react-router-dom';

const Index = () => (
  <div>
    当前: 活动首页
    <br />
    <Link to="/questions.html">去活动问题页</Link>
  </div>
);
Index.displayName = 'Index';
export default Index;

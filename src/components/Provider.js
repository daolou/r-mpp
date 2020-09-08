import React from 'react';
import ErrorBoundary from '~src/components/ErrorBoundary';
const FastClick = require('fastclick');

FastClick.attach(document.body);
const Provider = (ChildComponent) => {
  const Hoc = (props) => (
    <ErrorBoundary>
      <ChildComponent {...props} />
    </ErrorBoundary>
  );
  Hoc.displayName = `Hoc${ChildComponent.displayName || ChildComponent.name || 'Component'}`;
};

export default Provider;

import React from 'react';

export const withWrapper = (Context, value) => {
  return ({ children }) => React.createElement(Context.Provider, { value }, children);
};

import React, { createContext } from 'react';

// Create a context with a default value structure
const SidebarContext = createContext({
  state: null,
  update: () => {}
});

export default SidebarContext; 
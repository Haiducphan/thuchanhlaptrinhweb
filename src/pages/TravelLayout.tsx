import React from 'react';
import { TravelProvider } from './Travel/TravelContext';

const TravelLayout: React.FC<any> = (props) => {
  return (
    <TravelProvider>
      {props.children}
    </TravelProvider>
  );
};

export default TravelLayout;

import React from 'react';
import { TravelProvider } from './TravelContext';

export default (props: any) => <TravelProvider>{props.children}</TravelProvider>;

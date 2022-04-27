import { shallow, mount, render } from "enzyme";
import React from 'react'

import BottomIcons from '../views/bottomIcons';

it('expect to render Bottom Icons', () =>{
    expect(shallow(<BottomIcons />).length).toEqual(1)
})
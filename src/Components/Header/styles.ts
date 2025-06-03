import styled from 'styled-components'
import {  NavLink } from "react-router-dom";
import { Button, buttonClasses } from "@mui/material"

export const HeaderContainer = styled.div`
    height: 90px;
    width: 100%;
    background-color: #fff;
    display: flex;
    align-items: center;
    justify-content: space-between;
`
export const LinkContainer = styled.div`
    width: 400px;
    height: 80px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-left: 5%;
`

export const HeaderButton = styled(NavLink)`
    width: 160px;
  height: 30px;
  color: #595C62;
  text-decoration: none;
  font-size: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    color: #5046E3;
  }
  
  &.active {
    color: #5046E3;
  }
`

export const CreateTaskButton = styled(Button)({
    [`&.${buttonClasses.root}`]: {
      width: '170px',
      height: '50px',
      backgroundColor: '#5046E3',
      color: '#B4AFF1',
      marginRight: '5%'
    },
    [`&.${buttonClasses.root}:hover`]: {
      backgroundColor: '#655CCB',
    },
  });
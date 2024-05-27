import { Card } from "antd";
import styled from "styled-components";

export const WarapperCardStyle = styled(Card)`
      width:200px;
      & img {
            width: 200px;
            height: 200px;
      }
      position: relative;
      background-color: ${props => props.disabled ? '#ccc' : '#fff'};
      cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'}
`
export const WarapperImgStyle = styled.img`
      top: -1px
      left: -1px;
      border-top-left-radius; 3px;
      position: absolute;
      height: 20px;
      width: 72px:
`

export const StyleNameProduct = styled.div`
      font-size: 12px;
      font-weight: 400; 
      line-height: 16px;
      color: rgb(56, 56, 61);
`
export const WarapperReporText = styled.div`
      font-size: 12px;
      align-items 
      display: 'flex'
      color: rgb(128, 128, 137);
      margin: 6px 0 0px;
`
export const WarapperPriceText = styled.div`
      font-size: 16px;
      font-weight: 500; 
      color: rgb(255, 66, 78);
`

export const WarapperPriceDiscountText = styled.div`
      font-size: 12px;
      font-weight: 500; 
      color: rgb(255, 66, 78);
`
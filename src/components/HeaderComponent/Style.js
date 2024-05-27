import { Row } from "antd";
import styled from "styled-components";

export const WarapperHeader = styled(Row)`
      padding: 10px 120px;
      background-color: rgb(26, 148, 255);
`
export const WarapperText = styled.span`
      font-size: 25px;
      color: #fff;
      font-weight: bold; 
      font-style: italic;
      

`
export const WarapperHeaderAccount = styled.div`
      display: flex;
      align-items: center;
      color: #fff;
      gap: 10px;
`
export const WarapperTextSmall = styled.span`
      font-size: 12px;
      color: #fff;
`
export const WrapperContentPopup = styled.p`
    cursor: pointer;
    &:hover {
        color: rgb(26, 148, 255);
    }
`




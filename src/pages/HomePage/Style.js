import styled from "styled-components";
import ButtonComponent from '../../components/ButtonComponen/ButtonComponen'

export const WarapperTypeProduct = styled.div`
      display: flex;
      align-items: center;
      gap: 24px;
      justify-content: flex-start;
      border-bottom: 1px solid #efefef;
      height: 44px;
`

export const WrapperButtonMore = styled(ButtonComponent)`
    &:hover {
        color: #fff;
        background: rgb(13,92,182);
        span {
            color: #fff;
        }
    }
    width: 100%;
    color: #9255FD;
    text-align: center;
    text-color:rgb(13,92,182);
    cursor: ${(props) => props.disabled ? 'not-allowed' : 'pointers'}
`
export const WrapperProducts = styled.div`
    display: flex;
    gap: 25px;
    margin-top:20px;
    flex-wrap: wrap;
    
`
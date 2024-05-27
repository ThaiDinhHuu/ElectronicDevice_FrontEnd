import { Input } from 'antd'
import React from 'react'
import ButtonComponent from '../ButtonComponen/ButtonComponen'
import { SearchOutlined } from '@ant-design/icons'

const ButttonInputSearch = (props) => {
      const {
            size, placeholder, textbutton,
            bordered, backgroundColorInput = '#fff',
            backgroundColorButton = 'rgb(13, 92, 182)',
            colorButton = '#fff'
      } = props
      return (
            <div style={{ display: 'flex', }}>
                  <Input
                        size={size}
                        placeholder={placeholder}
                        bordered={bordered}
                        style={{ backgroundColor: backgroundColorInput, borderRadius: '0px' }}
                        {...props}
                  />
                  <ButtonComponent
                        size={size}
                        styleButton={{ background: backgroundColorButton, border: !bordered && 'none', borderRadius: '0px' }}
                        icon={<SearchOutlined color={colorButton} style={{ color: '#fff' }} />}
                        textbutton={textbutton}
                        styleTextButton={{ color: colorButton }}
                  />
            </div>
      )
}

export default ButttonInputSearch
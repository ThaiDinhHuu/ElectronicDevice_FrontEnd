import { Checkbox, Rate } from 'antd'
import React from 'react'
import { WrapperContent, WrapperLableText, WrapperTextPrice, WrapperTextValue } from './Style'

const NavBarComponent = () => {
      const onChange = () => { }
      const renderContent = (type, options) => {
            switch (type) {
                  case 'text':
                        return options.map((option) => {
                              return (
                                    <WrapperTextValue>{option}</WrapperTextValue>
                              )
                        })
                  case 'checkbox':
                        return (
                              <Checkbox.Group style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '12px' }} onChange={onChange}>
                                    {options.map((option) => {
                                          return (
                                                <Checkbox style={{ marginLeft: 0 }} value={option.value}>{option.label}</Checkbox>
                                          )
                                    })}
                              </Checkbox.Group>
                        )
                  case 'star':
                        return options.map((option) => {
                              return (
                                    <div style={{ dispaly: 'flex' }}>
                                          <Rate style={{ fontSize: '12px' }} disabled defaultValue={option} />
                                          <span> {`tu ${option}  sao`}</span>
                                    </div>
                              )
                        })
                  case 'price':
                        return options.map((option) => {
                              return (
                                    <WrapperTextPrice>{option}</WrapperTextPrice>
                              )
                        })
                  default:
                        return {}
            }
      }

      return (
            <div style={{ backgroundColor: "#fff", width: '200px', borderRadius: '10px' }}>
                  <WrapperLableText>Lable</WrapperLableText><br />
                  <WrapperContent>
                        {renderContent('text', ['Điện Thoại', 'Laptop', 'Đồng hồ', 'Tablet'])}
                  </WrapperContent>
                  <WrapperContent>
                        {renderContent('star', [3, 4, 5])}
                  </WrapperContent>
                  <WrapperContent>
                        {renderContent('price', ['Duoi 1.000.000', 'Tu 1.000.000-5.000.000'])}
                  </WrapperContent>
                  <WrapperContent>
                        {renderContent('checkbox', [
                              { value: 'a', label: 'A' },
                              { value: 'b', label: 'B' }
                        ])}
                  </WrapperContent>
            </div>
      )
}

export default NavBarComponent
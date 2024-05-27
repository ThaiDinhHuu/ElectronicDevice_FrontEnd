import React from 'react'
import { Card } from 'antd';
import {
      StyleNameProduct,
      WarapperReporText,
      WarapperPriceText,
      WarapperPriceDiscountText,
      WarapperImgStyle,
      WarapperCardStyle
} from "./Style"
import {
      StarOutlined,
} from '@ant-design/icons';
import logo from '../../assets/images/logo.png'
import { useNavigate } from 'react-router-dom';
import { convertPrice } from '../../utils';

const { Meta } = Card;

const CardComponent = (props) => {
      const { key, countInStock, description, image, name, discount, price, rating, type, selled, id } = props
      const naviagte = useNavigate()
      const handleDetailProduct = (id) => {
            naviagte(`/product-detail/${id}`)
      }

      return (
            <Card
                  hoverable
                  style={{ width: 240 }}
                  cover={<img alt="example" src={image} />}
                  onClick={() => handleDetailProduct(id)}
            >
                  <img src={logo} style={{ top: '-1px', left: '-1px', borderTopLeftRadius: '3px', position: 'absolute', height: '20px', width: '72px' }} />
                  <StyleNameProduct>{name}</StyleNameProduct>
                  <WarapperReporText>
                        <span style={{ marginRight: '4px' }}>
                              <span >{rating}</span><StarOutlined style={{ fontSize: "12px", color: "yellow" }} />
                        </span>
                        <span>| Đã bán {selled || 1000}+</span>
                  </WarapperReporText>
                  <WarapperPriceText>
                        <span style={{ marginRight: '8px' }}>{convertPrice(price)}</span>
                        <WarapperPriceDiscountText>
                              -{discount}%
                        </WarapperPriceDiscountText>
                  </WarapperPriceText>
            </Card>
      )
}

export default CardComponent
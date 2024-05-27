import React from 'react'
import HeaderComponent from '../../components/HeaderComponent/HeaderComponent'
import ProductDetailsComponent from '../../components/ProductDetailsComponent/ProductDetailsComponent'
import { useNavigate, useParams } from 'react-router-dom'

const ProductDetail = () => {
      const { id } = useParams()
      const navigate = useNavigate()
      return (
            <div>
                  <HeaderComponent />
                  <div style={{ width: '100%', background: '#efefef', height: '2000px', padding: '0' }}>
                        <div style={{ width: '1270px', height: '100%', marginLeft: '265px' }} >
                              <h3><span style={{ cursor: 'pointer', fontWeight: 'bold', fontSize: '20px' }} onClick={() => navigate('/')}>Trang chủ</span ><span style={{ fontSize: '20px' }} > - Chi tiết sản phẩm</span> </h3>
                              <ProductDetailsComponent idProduct={id} />
                        </div>
                  </div>

            </div>
      )
}

export default ProductDetail
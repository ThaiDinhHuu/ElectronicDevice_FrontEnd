import { Col, Pagination, Row } from 'antd'
import React, { useEffect, useState } from 'react'
import NavBarComponent from '../../components/NavBarComponent/NavBarComponent'
import CardComponent from '../../components/CardComponent/CardComponent'
import HeaderComponent from '../../components/HeaderComponent/HeaderComponent'
import { WrapperProducts, WrapperNavbar } from './Style'
import { useLocation } from 'react-router-dom'
import * as ProductService from '../../services/ProductService'
import Loading from '../../components/LoadingComponent/Loading'
import { useSelector } from 'react-redux'
import { useDebounce } from '../../hooks/useDebounce'

const TypeProductPage = () => {
      const searchProduct = useSelector((state) => state?.product?.search)
      const searchDebounce = useDebounce(searchProduct, 1000)

      const { state } = useLocation()
      const [products, setProducts] = useState([])
      const [loading, setLoading] = useState(false)
      const [panigate, setPanigate] = useState({
            page: 0,
            limit: 4,
            total: 1,
      })
      const fechProductType = async (type, page, limit) => {
            setLoading(true)
            const res = await ProductService.getProductType(type, page, limit)
            if (res?.status === 'OK') {
                  setLoading(false)
                  setProducts(res.data)
                  setPanigate({ ...panigate, total: res?.totalPage })
            } else {
                  setLoading(false)
            }
      }
      console.log('search', searchProduct)
      useEffect(() => {
            if (state) {
                  fechProductType(state, panigate.page, panigate.limit)
            }

      }, [state, panigate.page, panigate.limit])

      const onChange = (current, pageSize) => {
            setPanigate({ ...panigate, page: current - 1, limit: pageSize })
      }
      return (
            <div>
                  <HeaderComponent />
                  <Loading isLoading={loading}>

                        <Row style={{ padding: '0 120px', background: '#efefef', flexWrap: 'nowrap', paddingTop: '20px', height: '900px', }}>
                              <WrapperNavbar span={4} style={{ marginLeft: "150px" }}>
                                    <NavBarComponent />
                              </WrapperNavbar>
                              <Col span={20} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                    <WrapperProducts style={{ width: '1200px' }} >
                                          {products?.filter((pro) => {
                                                if (searchDebounce === '') {
                                                      return pro
                                                } else if (pro?.name?.toLowerCase()?.includes(searchDebounce?.toLowerCase())) {
                                                      return pro
                                                }
                                          })?.map((product) => {
                                                return (
                                                      <CardComponent
                                                            key={product._id}
                                                            countInStock={product.countInStock}
                                                            description={product.description}
                                                            image={product.image}
                                                            name={product.name}
                                                            price={product.price}
                                                            rating={product.rating}
                                                            type={product.type}
                                                            selled={product.selled}
                                                            discount={product.discount}
                                                            id={product._id}
                                                      />
                                                )
                                          })}


                                    </WrapperProducts>
                                    <Pagination defaultCurrent={panigate.page + 1} total={panigate?.total} onChange={onChange} style={{ textAlign: 'center', marginTop: '10px' }} />
                              </Col>


                        </Row>
                  </Loading>
            </div>

      )
}

export default TypeProductPage
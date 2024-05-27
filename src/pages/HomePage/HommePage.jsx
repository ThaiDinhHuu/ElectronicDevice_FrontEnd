import React, { useEffect, useRef, useState } from 'react'
import HeaderComponent from '../../components/HeaderComponent/HeaderComponent'
import TypeProduct from '../../components/TypeProducts/TypeProduct'
import SliderComponent from '../../components/SliderComponents/SliderComponent'
import { WarapperTypeProduct, WrapperButtonMore, WrapperProducts } from './Style'
import slider1 from '../../assets/images/slider1.jpg'
import slider2 from '../../assets/images/slider2.jpg'
import slider3 from '../../assets/images/slider3.jpg'
import CardComponent from '../../components/CardComponent/CardComponent'
import NavBarComponent from '../../components/NavBarComponent/NavBarComponent'
import ButtonComponent from '../../components/ButtonComponen/ButtonComponen'
import * as ProductService from '../../services/ProductService'
import { useQuery } from '@tanstack/react-query'
import { useSelector } from 'react-redux'
import Loading from '../../components/LoadingComponent/Loading'
import { useDebounce } from '../../hooks/useDebounce'
import FooterComponent from '../../components/FooterComponent/FooterComponent'

const HommePage = () => {
      const searchProduct = useSelector((state) => state?.product?.search)
      const refSearch = useRef()
      const [stateProducts, setStateProducts] = useState([])
      const [limit, setLimit] = useState(10)
      const [loading, setLoading] = useState(false)
      const [typeProduct, setTypeProduct] = useState([])
      const searchDebounce = useDebounce(searchProduct, 1000)

      const fetchProductAll = async (context) => {
            const limit = context?.queryKey && context?.queryKey[1]
            const search = context?.queryKey && context?.queryKey[2]
            const res = await ProductService.getAllProduct(search, limit)


            return res


      }

      const fetchAllTypeProduct = async () => {
            const res = await ProductService.getAllTypeProduct()
            if (res?.status === 'OK') {
                  setTypeProduct(res.data)
            }
      }



      useEffect(() => {
            if (refSearch.current) {
                  setLoading(true)
                  fetchProductAll(searchDebounce)
            }
            refSearch.current = true
            setLoading(false)
      }, [searchDebounce])

      const { isLoading, data: products } = useQuery(['products', limit, searchDebounce], fetchProductAll, { retry: 3, retryDelay: 1000 })

      useEffect(() => {
            fetchAllTypeProduct()
      }, [])

      useEffect(() => {
            if (products?.data?.length > 0) {
                  setStateProducts(products?.data)
            }
      }, [products])
      return (
            <Loading isLoading={isLoading || loading}>
                  <div >
                        <HeaderComponent />
                        <div style={{ padding: '0 120px', fontSize: '15px', marginLeft: '150px' }}>
                              <WarapperTypeProduct  >
                                    {typeProduct.map((item) => {
                                          return (
                                                <TypeProduct name={item} key={item} />
                                          )
                                    })}
                              </WarapperTypeProduct>

                        </div>
                        <div id='container' style={{ backgroundColor: '#efefef', padding: '0 120px' }}>
                              <div style={{ marginLeft: '150px' }}>
                                    <SliderComponent arrImages={[slider1, slider2, slider3]} />
                              </div>

                              <WrapperProducts style={{ marginLeft: '150px' }}  >
                                    {stateProducts?.map((product) => {
                                          return (
                                                <CardComponent
                                                      key={product._id}
                                                      countInStock={product.countInStock}
                                                      description={product.description}
                                                      image={product.image}
                                                      name={product.name}
                                                      discount={product.discount}
                                                      price={product.price}
                                                      rating={product.rating}
                                                      type={product.type}
                                                      selled={product.selled}
                                                      id={product._id}
                                                />
                                          )
                                    })}
                              </WrapperProducts>
                              <div style={{ marginTop: '10px', display: 'flex', width: '100%', alignItems: 'center', justifyContent: "center" }}>

                                    <WrapperButtonMore
                                          textbutton={"Xem thêm"} type="outline" styleButton={{
                                                border: "1px solid rgb(13,92,182)", color: 'rgb(13,92,182)',
                                                width: '240px', height: '38px', borderRadius: '4px'
                                          }}
                                          // disabled={products?.total === products?.data?.length || products?.totalPage === 1}
                                          styleTextButton={{ fontWeight: 500 }}
                                          onClick={() => setLimit((prev) => prev + 5)}
                                    />
                              </div>
                        </div>
                        <FooterComponent />
                  </div>
            </Loading>
      )
}

export default HommePage
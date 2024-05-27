import React, { useEffect, useState } from 'react'
import { WrapperStyleImageSmall, WrapperStyleColImage, WrapperStyleNameProduct, WrapperStyleTextSell, WrapperPriceProduct, WrapperPriceTextProduct, WrapperAddressProduct, WrapperQualityProduct, WrapperInputNumber, WrapperBtnQualityProduct } from './Style'
import { PlusOutlined, MinusOutlined } from '@ant-design/icons'
import { Button, Col, Image, Rate, Row } from 'antd'
import imageProductSmall from '../../assets/images/imagesmall.webp'
import productDetails from '../../assets/images/test.webp'
import { useQuery } from '@tanstack/react-query'
import * as ProductService from '../../services/ProductService'
import { convertPrice, initFacebookSDK } from '../../utils'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import { addOrderProduct, resetOrder } from '../../dux/slides/orderSlide'
import * as message from '../Message/Message'
import Loading from '../LoadingComponent/Loading'
import LikeButtonComponent from '../LikeButtonComponent/LikeButtonComponent'
import CommentComponent from '../CommentComponent/CommentComponent'
import { ModalContent } from './Model'

const ProductDetailsComponent = ({ idProduct }) => {
      const [numProduct, setNumProduct] = useState(1)
      const [errorLimitOrder, setErrorLimitOrder] = useState(false)
      const navigate = useNavigate()
      const user = useSelector((state) => state.user)
      const order = useSelector((state) => state.order)
      const location = useLocation()
      const dispatch = useDispatch()
      const [modalOpen, setModalOpen] = useState(false);

      const openModal = () => {
            setModalOpen(true);
      };

      // Hàm đóng modal
      const closeModal = () => {
            setModalOpen(false);
      };

      const onChange = (value) => {
            setNumProduct(Number(value))
      }

      const fetchGetDetailsProduct = async (context) => {
            const id = context?.queryKey && context?.queryKey[1]
            if (id) {
                  const res = await ProductService.getDetailsProduct(id)
                  return res.data
            }
      }
      useEffect(() => {
            initFacebookSDK()
      }, [])

      useEffect(() => {
            const orderRedux = order?.orderItems?.find((item) => item.product === productDetails?._id)
            if ((orderRedux?.amount + numProduct) <= orderRedux?.countInstock || (!orderRedux && productDetails?.countInStock > 0)) {
                  setErrorLimitOrder(false)
            } else if (productDetails?.countInStock === 0) {
                  setErrorLimitOrder(true)
            }
      }, [numProduct])

      useEffect(() => {
            if (order.isSucessOrder) {
                  message.success('Đã thêm vào giỏ hàng')
            }
            return () => {
                  dispatch(resetOrder())
            }
      }, [order.isSucessOrder])
      const handleChangeCount = (type, limited) => {
            if (type === 'increase') {
                  if (!limited) {
                        setNumProduct(numProduct + 1)
                  }
            } else {
                  if (!limited) {
                        setNumProduct(numProduct - 1)
                  }
            }
      }

      const { isLoading, data: productDetails } = useQuery(['product-details', idProduct], fetchGetDetailsProduct, { enabled: !!idProduct })

      const handleAddOrderProduct = () => {
            if (!user?.id) {
                  navigate('/sign-in', { state: location?.pathname })
            } else {
                  const orderRedux = order?.orderItems?.find((item) => item.product === productDetails?._id)
                  if ((orderRedux?.amount + numProduct) <= orderRedux?.countInstock || (!orderRedux && productDetails?.countInStock > 0)) {
                        dispatch(addOrderProduct({
                              orderItem: {
                                    name: productDetails?.name,
                                    amount: numProduct,
                                    image: productDetails?.image,
                                    price: productDetails?.price,
                                    product: productDetails?._id,
                                    discount: productDetails?.discount,
                                    countInstock: productDetails?.countInStock,

                              }
                        }))
                  } else {
                        setErrorLimitOrder(true)
                  }
            }
      }
      return (
            <Loading isLoading={isLoading}>
                  <div style={{ marginTop: '25px', }}>
                        <Row style={{ padding: '20px', background: '#fff', borderRadius: '4px', height: '100%' }}>
                              <Col span={10} style={{ borderRight: '1px solid #e5e5e5', paddingRight: '8px' }}>
                                    <Image src={productDetails?.image} alt="image prodcut" preview={false} onClick={openModal} />
                                    {modalOpen && (
                                          <ModalContent onClose={() => setModalOpen(false)} >

                                                <img className="modal-content" src={productDetails?.image} alt="Large Image" />
                                          </ModalContent>
                                    )}
                                    <Row style={{ paddingTop: '10px', justifyContent: 'space-between' }}>
                                          <WrapperStyleColImage span={4} sty>
                                                <WrapperStyleImageSmall src={productDetails?.image} alt="image small" preview={false} />
                                          </WrapperStyleColImage>
                                          <WrapperStyleColImage span={4}>
                                                <WrapperStyleImageSmall src={productDetails?.image} alt="image small" preview={false} />
                                          </WrapperStyleColImage>

                                          <WrapperStyleColImage span={4}>
                                                <WrapperStyleImageSmall src={productDetails?.image} alt="image small" preview={false} />
                                          </WrapperStyleColImage>

                                          <WrapperStyleColImage span={4}>
                                                <WrapperStyleImageSmall src={productDetails?.image} alt="image small" preview={false} />
                                          </WrapperStyleColImage>

                                          <WrapperStyleColImage span={4}>
                                                <WrapperStyleImageSmall src={productDetails?.image} alt="image small" preview={false} />
                                          </WrapperStyleColImage>

                                          <WrapperStyleColImage span={4}>
                                                <WrapperStyleImageSmall src={productDetails?.image} alt="image small" preview={false} />
                                          </WrapperStyleColImage>

                                    </Row>
                              </Col>
                              <Col span={14} style={{ paddingLeft: '10px' }}>
                                    <WrapperStyleNameProduct>{productDetails?.name}</WrapperStyleNameProduct>
                                    <div>
                                          <Rate allowHalf defaultValue={productDetails?.rating} value={productDetails?.rating} />
                                          <WrapperStyleTextSell> | Da ban {productDetails?.selled || 100}+</WrapperStyleTextSell>
                                    </div>
                                    <WrapperPriceProduct>
                                          <WrapperPriceTextProduct>{convertPrice(productDetails?.price)}</WrapperPriceTextProduct>
                                    </WrapperPriceProduct>
                                    <WrapperAddressProduct>
                                          <span>Giao đến </span>
                                          <span className='address'>{user?.address}</span> -
                                          <span className='change-address'>Đổi địa chỉ</span>
                                    </WrapperAddressProduct>
                                    <LikeButtonComponent
                                          dataHref={
                                                "https://developers.facebook.com/docs/plugins/"

                                          }
                                    />

                                    <div style={{ margin: '10px 0 20px', padding: '10px 0', borderTop: '1px solid #e5e5e5', borderBottom: '1px solid #e5e5e5' }}>
                                          <div style={{ marginBottom: '10px' }}>Số lượng</div>
                                          <WrapperQualityProduct>
                                                <button style={{ border: 'none', background: 'transparent', cursor: 'pointer' }} onClick={() => handleChangeCount('decrease', numProduct === 1)}>
                                                      <MinusOutlined style={{ color: '#000', fontSize: '20px' }} />
                                                </button>
                                                <WrapperInputNumber onChange={onChange} defaultValue={1} max={productDetails?.countInStock} min={1} value={numProduct} size="small" />
                                                <button style={{ border: 'none', background: 'transparent', cursor: 'pointer' }} onClick={() => handleChangeCount('increase', numProduct === productDetails?.countInStock)}>
                                                      <PlusOutlined style={{ color: '#000', fontSize: '20px' }} />
                                                </button>
                                          </WrapperQualityProduct>
                                    </div>
                                    <div style={{ display: 'flex', aliggItems: 'center', gap: '12px' }}>
                                          <div>
                                                <Button
                                                      size={40}
                                                      style={{
                                                            background: 'rgb(255, 57, 69)',
                                                            height: '48px',
                                                            width: '220px',
                                                            border: 'none',
                                                            borderRadius: '4px'
                                                      }}
                                                      onClick={handleAddOrderProduct}

                                                ><span style={{ color: '#fff', fontSize: '15px', fontWeight: '700' }}>Chọn mua</span></Button>
                                                {errorLimitOrder && <div style={{ color: 'red' }}>San pham het hang</div>}
                                          </div>
                                          <Button
                                                size={40}
                                                style={{
                                                      background: '#fff',
                                                      height: '48px',
                                                      width: '220px',
                                                      border: '1px solid rgb(13, 92, 182)',
                                                      borderRadius: '4px'
                                                }}
                                                textbutton={'Mua trả sau'}

                                          ><span style={{ color: 'rgb(13, 92, 182)', fontSize: '15px' }}>Mua trả sau</span></Button>
                                    </div>
                                    <div style={{ marginTop: '10px' }}>
                                          <span style={{ fontSize: '20px' }}>Thông tin sản phẩm</span><br />
                                          <span style={{ fontSize: '16px', marginTop: '20px' }}>{productDetails?.description}</span>
                                    </div>
                              </Col>
                              <CommentComponent
                                    dataHref={"https://developers.facebook.com/docs/plugins/comments#configurator"

                                    }
                                    width="1270"
                              />
                        </Row >
                  </div>
            </Loading>
      )
}

export default ProductDetailsComponent
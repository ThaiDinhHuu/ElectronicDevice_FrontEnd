import React, { useMemo } from 'react'
import HeaderComponent from '../../components/HeaderComponent/HeaderComponent'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import * as OrderService from '../../services/OrderService'
import { useQuery } from '@tanstack/react-query'
import { WrapperAllPrice, WrapperContentInfo, WrapperHeaderUser, WrapperInfoUser, WrapperItem, WrapperItemLabel, WrapperLabel, WrapperNameProduct, WrapperProduct, WrapperStyleContent } from './style'
import { convertPrice } from '../../utils'
import { orderContant } from '../../contant'
import Loading from '../../components/LoadingComponent/Loading'
import { useSelector } from 'react-redux'
import { DoubleLeftOutlined } from '@ant-design/icons'

const DetailsOrderPage = () => {
      const params = useParams()
      const user = useSelector((state) => state.user)
      const navigate = useNavigate()
      const location = useLocation()
      const { state } = location
      const { id } = params

      const fetchDetailsOrder = async () => {
            const res = await OrderService.getDetailsOrder(id, state?.token)
            return res.data
      }

      const queryOrder = useQuery({ queryKey: ['orders-details'], queryFn: fetchDetailsOrder }, {
            enabled: id
      })
      const { isLoading, data } = queryOrder

      const priceMemo = useMemo(() => {
            const result = data?.orderItems?.reduce((total, cur) => {
                  return total + ((cur.price * cur.amount))
            }, 0)
            return result
      }, [data])

      return (
            <div>

                  <HeaderComponent />
                  <Loading isLoading={isLoading}>
                        <div style={{ width: '100%', background: '#f5f5fa' }}>
                              <div style={{ width: '1270px', margin: '0 auto', height: '1270px', marginLeft: '270px' }}>
                                    <h3>CHI TIẾT ĐƠN HÀNG</h3>
                                    <WrapperHeaderUser style={{ marginTop: '25px' }}>
                                          <WrapperInfoUser>
                                                <WrapperLabel>Địa chỉ người nhận</WrapperLabel>
                                                <WrapperContentInfo>
                                                      <div className='name-info' style={{ marginTop: '6px' }}>{data?.shippingAddress?.fullName}</div><br />
                                                      <div className='address-info'><span>Địa chỉ: </span> {`${data?.shippingAddress?.address} ${data?.shippingAddress?.city}`}</div>
                                                      <div className='phone-info'><span>Điện thoại: </span> {data?.shippingAddress?.phone}</div>
                                                </WrapperContentInfo>
                                          </WrapperInfoUser>
                                          <WrapperInfoUser>
                                                <WrapperLabel>Hình thức giao hàng</WrapperLabel>
                                                <WrapperContentInfo>
                                                      <div className='delivery-info'><span className='name-delivery'>FAST </span>Giao hàng tiết kiệm</div>
                                                      <div className='delivery-fee'><span>Phí giao hàng: </span> {data?.shippingPrice}</div>
                                                </WrapperContentInfo>
                                          </WrapperInfoUser>
                                          <WrapperInfoUser>
                                                <WrapperLabel>Hình thức thanh toán</WrapperLabel>
                                                <WrapperContentInfo>
                                                      <div className='payment-info'>{orderContant.payment[data?.paymentMethod]}</div>
                                                      <div className='status-payment'>{data?.isPaid ? 'Đã thanh toán' : 'Chưa thanh toán'}</div>
                                                </WrapperContentInfo>
                                          </WrapperInfoUser>
                                    </WrapperHeaderUser>
                                    <WrapperStyleContent>
                                          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#fff', borderRadius: '6px' }}>
                                                <div style={{ width: '670px', marginLeft: '15px' }}>Sản phẩm</div>
                                                <WrapperItemLabel>Giá</WrapperItemLabel>
                                                <WrapperItemLabel>Số lượng</WrapperItemLabel>
                                                <WrapperItemLabel style={{}}>Giảm giá</WrapperItemLabel>
                                          </div>
                                          {data?.orderItems?.map((order) => {
                                                return (
                                                      <WrapperProduct style={{ backgroundColor: '#fff', borderRadius: '6px', height: '100px', marginTop: '1px' }}>
                                                            <WrapperNameProduct style={{ marginLeft: '10px', marginTop: '10px' }}>
                                                                  <img src={order?.image}
                                                                        style={{
                                                                              width: '70px',
                                                                              height: '70px',
                                                                              objectFit: 'cover',
                                                                              border: '1px solid rgb(238, 238, 238)',
                                                                              padding: '2px',
                                                                              borderRadius: '10px'
                                                                        }}
                                                                  />
                                                                  <div style={{
                                                                        width: 260,
                                                                        overflow: 'hidden',
                                                                        textOverflow: 'ellipsis',
                                                                        whiteSpace: 'nowrap',
                                                                        marginLeft: '10px',
                                                                        height: '70px',

                                                                  }}>{order?.name}</div>
                                                            </WrapperNameProduct>
                                                            <WrapperItem style={{ marginTop: '10px' }}>{convertPrice(order?.price)}</WrapperItem>
                                                            <WrapperItem style={{ marginTop: '10px' }}>{order?.amount}</WrapperItem>
                                                            <WrapperItem style={{ marginTop: '10px' }}>{order?.discount ? convertPrice(priceMemo * order?.discount / 100) : '0 VND'}</WrapperItem>


                                                      </WrapperProduct>
                                                )
                                          })}
                                          <div style={{ marginBottom: '20px', backgroundColor: '#fff', borderRadius: '6px', height: '180px' }}>
                                                <WrapperAllPrice style={{ marginTop: '10px' }} >
                                                      <WrapperItemLabel>Tạm tính</WrapperItemLabel>
                                                      <WrapperItem>{convertPrice(priceMemo)}</WrapperItem>
                                                </WrapperAllPrice><br />
                                                <WrapperAllPrice>
                                                      <WrapperItemLabel>Phí vận chuyển</WrapperItemLabel>
                                                      <WrapperItem >{convertPrice(data?.shippingPrice)}</WrapperItem>
                                                </WrapperAllPrice><br />
                                                <WrapperAllPrice>
                                                      <WrapperItemLabel>Tổng cộng</WrapperItemLabel>
                                                      <WrapperItem><WrapperItem style={{ color: 'red' }}>{convertPrice(data?.totalPrice)}</WrapperItem></WrapperItem>
                                                </WrapperAllPrice>
                                          </div>
                                    </WrapperStyleContent>

                                    <div style={{ cursor: 'pointer', color: "rgb(11, 116, 229)", marginTop: '10px' }} onClick={() => navigate('/myOrder', { state: { id: user?.id, token: user?.access_token } })}>  <DoubleLeftOutlined />Quy lại đơn hàng</div>
                              </div>
                        </div>
                  </Loading>
            </div>
      )
}

export default DetailsOrderPage
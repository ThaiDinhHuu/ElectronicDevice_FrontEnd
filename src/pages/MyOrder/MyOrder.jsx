import React, { useEffect } from 'react'
import { WrapperItemOrder, WrapperListOrder, WrapperHeaderItem, WrapperFooterItem, WrapperContainer, WrapperStatus } from './style'
import ButtonComponent from '../../components/ButtonComponen/ButtonComponen'
import HeaderComponent from '../../components/HeaderComponent/HeaderComponent'
import { useLocation, useNavigate } from 'react-router-dom'
import * as OrderService from '../../services/OrderService'
import { useSelector } from 'react-redux'
import { useQuery } from '@tanstack/react-query'
import { convertPrice } from '../../utils'
import Loading from '../../components/LoadingComponent/Loading'
import { useMutationHooks } from '../../hooks/useMutationHook'
import * as message from '../../components/Message/Message'

const MyOrder = () => {
      const location = useLocation()
      const user = useSelector((state) => state.user)
      const { state } = location
      const navigate = useNavigate()

      const fetchMyOrder = async () => {
            const res = await OrderService.getOrderByUserId(state?.id, state?.token)
            return res.data
      }

      const queryOrder = useQuery({ queryKey: ['orders'], queryFn: fetchMyOrder }, {
            enabled: state?.id && state?.token
      })

      const { isLoading, data } = queryOrder

      const handleDetailsOrder = (id) => {
            navigate(`/details-order/${id}`, {
                  state: {
                        token: state?.token
                  }
            })
      }

      const mutation = useMutationHooks(
            (data) => {
                  const { id, token, orderItems, userId } = data
                  const res = OrderService.cancelOrder(id, token, orderItems, userId)
                  return res
            }
      )
      const handleCanceOrder = (order) => {
            mutation.mutate({ id: order._id, token: state?.token, orderItems: order?.orderItems, userId: user.id }, {
                  onSuccess: () => {
                        queryOrder.refetch()
                  },
            })
      }
      const { isLoading: isLoadingCancel, isSuccess: isSuccessCancel, isError: isErrorCancle, data: dataCancel } = mutation

      useEffect(() => {
            if (isSuccessCancel && dataCancel?.status === 'OK') {
                  message.success()
            } else if (isSuccessCancel && dataCancel?.status === 'ERR') {
                  message.error(dataCancel?.message)
            } else if (isErrorCancle) {
                  message.error()
            }
      }, [isErrorCancle, isSuccessCancel])
      const renderProduct = (data) => {
            return data?.map((order) => {
                  return <WrapperHeaderItem key={order?._id}>
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
                              fontSize: '16px'
                        }}>{order?.name}</div>
                        <span style={{ fontSize: '13px', color: '#242424', marginLeft: 'auto', fontSize: '16px' }}>{convertPrice(order?.price)}</span>
                  </WrapperHeaderItem>
            })
      }
      return (

            <div >
                  <HeaderComponent />
                  <Loading isLoading={isLoading || isLoadingCancel}>
                        <div >
                              <WrapperContainer>
                                    <div style={{ height: '100vh', width: '1270px', margin: '0 auto', marginLeft: '270px' }}>
                                          <h3 style={{ marginLeft: '170px' }}>ĐƠN HÀNG</h3>
                                          <WrapperListOrder style={{ marginLeft: '50px' }}>
                                                {data?.map((order) => {
                                                      return (
                                                            <WrapperItemOrder key={order?._id}>
                                                                  <WrapperStatus>
                                                                        <span style={{ fontSize: '14px', fontWeight: 'bold', }}>Trạng thái</span><br />
                                                                        <div>
                                                                              <span style={{ color: 'rgb(128, 128, 137)', }}>Giao hàng: </span>
                                                                              <span style={{ color: 'rgb(11, 116, 229)', fontWeight: 'bold', }}>{`${order.isDelivered ? 'Đã giao hàng' : 'Chưa giao hàng'}`}</span>
                                                                        </div>
                                                                        <div>
                                                                              <span style={{ color: 'rgb(128, 128, 137)', }}>Thanh toán: </span>
                                                                              <span style={{ color: 'rgb(11, 116, 229)', fontWeight: 'bold', }}>{`${order.isPaid ? 'Đã thanh toán' : 'Chưa thanh toán'}`}</span>
                                                                        </div>
                                                                  </WrapperStatus>
                                                                  {renderProduct(order?.orderItems)}
                                                                  <WrapperFooterItem>
                                                                        <div>
                                                                              <span style={{ color: 'rgb(128, 128, 137)', fontSize: '16px' }}>Tổng tiền: </span>
                                                                              <span
                                                                                    style={{ fontSize: '13px', color: 'rgb(56, 56, 61)', fontWeight: 700, fontSize: '16px' }}
                                                                              >{convertPrice(order?.totalPrice)}</span>
                                                                        </div>
                                                                        <div style={{ display: 'flex', gap: '10px' }}>
                                                                              <ButtonComponent
                                                                                    onClick={() => handleCanceOrder(order)}
                                                                                    size={40}
                                                                                    styleButton={{
                                                                                          height: '36px',
                                                                                          border: '1px solid rgb(11, 116, 229)',
                                                                                          borderRadius: '4px'
                                                                                    }}
                                                                                    textbutton={'Hủy đơn hàng'}
                                                                                    styleTextButton={{ color: 'rgb(11, 116, 229)', fontSize: '14px' }}
                                                                              >
                                                                              </ButtonComponent>
                                                                              <ButtonComponent
                                                                                    onClick={() => handleDetailsOrder(order?._id)}
                                                                                    size={40}
                                                                                    styleButton={{
                                                                                          height: '36px',
                                                                                          border: '1px solid rgb(11, 116, 229)',
                                                                                          borderRadius: '4px'
                                                                                    }}
                                                                                    textbutton={'Xem chi tiết'}
                                                                                    styleTextButton={{ color: 'rgb(11, 116, 229)', fontSize: '14px' }}
                                                                              >
                                                                              </ButtonComponent>
                                                                        </div>
                                                                  </WrapperFooterItem>
                                                            </WrapperItemOrder>
                                                      )
                                                })}
                                          </WrapperListOrder>
                                    </div>
                              </WrapperContainer>
                        </div>
                  </Loading>
            </div>

      )
}

export default MyOrder
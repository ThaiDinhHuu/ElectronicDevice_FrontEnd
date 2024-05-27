import { useLocation, useNavigate } from "react-router-dom"
import Loading from "../../components/LoadingComponent/Loading"
import { Lable, WrapperInfo, WrapperContainer, WrapperValue, WrapperItemOrder, WrapperItemOrderInfo } from './style'
import { convertPrice } from "../../utils"
import React from 'react'
import HeaderComponent from "../../components/HeaderComponent/HeaderComponent"
import { orderContant } from "../../contant"
import ButtonComponent from "../../components/ButtonComponen/ButtonComponen"


const OrderSucess = () => {
      const location = useLocation()
      const naviagte = useNavigate()
      const { state } = location
      return (
            <div>
                  <HeaderComponent />
                  <div style={{ background: '#f5f5fa', with: '100%', height: '100vh' }}>
                        <Loading isLoading={false}>
                              <div style={{ height: '100%', width: '1270px', margin: '0 auto', marginLeft: '270px' }}>
                                    <h3>ĐẶT HÀNG THÀNH CÔNG</h3>
                                    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '25px' }}>
                                          <WrapperContainer>
                                                <WrapperInfo>
                                                      <div>
                                                            <Lable >Phương thức giao hàng</Lable>
                                                            <WrapperValue>
                                                                  <span style={{ color: '#ea8500', fontWeight: 'bold' }}>{orderContant.delivery[state?.delivery]}</span> Giao hàng tiết kiệm
                                                            </WrapperValue>
                                                      </div>
                                                </WrapperInfo>
                                                <WrapperInfo>
                                                      <div>
                                                            <Lable>Phương thức thanh toán</Lable>

                                                            <WrapperValue>
                                                                  {orderContant.payment[state?.payment]}
                                                            </WrapperValue>
                                                      </div>
                                                </WrapperInfo>
                                                <WrapperItemOrderInfo>
                                                      {state.orders?.map((order) => {
                                                            return (
                                                                  <WrapperItemOrder key={order?.name}>
                                                                        <div style={{ width: '500px', display: 'flex', alignItems: 'center', gap: 4, }}>
                                                                              <img src={order.image} style={{ width: '77px', height: '79px', objectFit: 'cover', borderRadius: '10px' }} />
                                                                              <div style={{
                                                                                    width: 260,
                                                                                    overflow: 'hidden',
                                                                                    textOverflow: 'ellipsis',
                                                                                    whiteSpace: 'nowrap'
                                                                              }}>{order?.name}</div>
                                                                        </div>
                                                                        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                                              <span>
                                                                                    <span style={{ fontSize: '13px', color: '#242424', }}>Giá tiền: {convertPrice(order?.price)}</span>
                                                                              </span>
                                                                              <span>
                                                                                    <span style={{ fontSize: '13px', color: '#242424', }}>Số lượng: {order?.amount}</span>
                                                                              </span>
                                                                        </div>
                                                                  </WrapperItemOrder>
                                                            )
                                                      })}
                                                </WrapperItemOrderInfo>
                                                <div style={{ marginTop: '10px' }}>
                                                      <span style={{ fontSize: '16px', color: 'red', marginTop: '10px' }}>Tổng tiền: {convertPrice(state?.totalPriceMemo)}</span><br />
                                                </div>
                                                <ButtonComponent
                                                      onClick={() => naviagte('/')}
                                                      size={40}
                                                      styleButton={{
                                                            height: '36px',
                                                            border: '1px solid rgb(11, 116, 229)',
                                                            borderRadius: '4px'

                                                            , marginTop: '10px'
                                                      }}
                                                      textbutton={'Trở về trang chủ'}
                                                      styleTextButton={{ color: 'rgb(11, 116, 229)', fontSize: '14px' }}
                                                >
                                                </ButtonComponent>
                                          </WrapperContainer>
                                    </div>
                              </div>
                        </Loading>
                  </div>

            </div>
      )
}

export default OrderSucess
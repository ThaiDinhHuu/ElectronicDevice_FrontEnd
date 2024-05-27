import { Form, Input, Radio } from 'antd'
import React, { useEffect, useMemo, useState } from 'react'
import { Lable, WrapperInfo, WrapperLeft, WrapperRadio, WrapperRight, WrapperTotal } from "./style"
import Loading from '../../components/LoadingComponent/Loading'
import ButtonComponent from '../../components/ButtonComponen/ButtonComponen'
import ModalComponent from '../../components/ModalComponent/ModalComponent'
import HeaderComponent from '../../components/HeaderComponent/HeaderComponent'
import { useDispatch, useSelector } from 'react-redux'
import { convertPrice } from '../../utils'
import * as UserService from '../../services/UserServices'
import * as PaymentService from '../../services/PaymentService'
import * as OrderService from '../../services/OrderService'
import * as message from '../../components/Message/Message'
import { useMutationHooks } from '../../hooks/useMutationHook'
import { updateUser } from '../../dux/slides/userSlide'
import { useNavigate } from 'react-router-dom'
import { removeAllOrderProduct } from '../../dux/slides/orderSlide'
import { PayPalButton } from 'react-paypal-button-v2'

const PaymentPage = () => {
      const order = useSelector((state) => state.order)
      const user = useSelector((state) => state.user)
      const [sdkReady, setSdkReady] = useState(false)
      const navigate = useNavigate()
      const [payment, setPayment] = useState('later_money')
      const [delivery, setDelivery] = useState('fast')
      const dispatch = useDispatch()
      const [isOpenModalUpdateInfo, setIsOpenModalUpdateInfo] = useState(false)
      const [stateUserDetails, setStateUserDetails] = useState({
            name: '',
            phone: '',
            address: '',
            city: ''
      })
      const [form] = Form.useForm();
      const mutationUpdate = useMutationHooks(
            (data) => {
                  const { id,
                        token,
                        ...rests } = data
                  const res = UserService.updateUser(
                        id,
                        { ...rests }, token)
                  return res
            },
      )

      const mutationAddOrder = useMutationHooks(
            (data) => {
                  const {
                        token,
                        ...rests } = data
                  const res = OrderService.createOrder(
                        { ...rests }, token)
                  return res
            },
      )

      const handleAddOrder = () => {
            if (user?.access_token && order?.orderItemsSlected && user?.name
                  && user?.address && user?.phone && user?.city && priceMemo && user?.id) {

                  mutationAddOrder.mutate(
                        {
                              token: user?.access_token,
                              orderItems: order?.orderItemsSlected,
                              fullName: user?.name,
                              address: user?.address,
                              phone: user?.phone,
                              city: user?.city,
                              paymentMethod: payment,
                              itemsPrice: priceMemo,
                              shippingPrice: diliveryPriceMemo,
                              totalPrice: totalPriceMemo,
                              user: user?.id,
                              email: user?.email
                        }
                  )
                  const arrayOrdered = []
                  order?.orderItemsSlected?.forEach(element => {
                        arrayOrdered.push(element.product)
                  });
                  dispatch(removeAllOrderProduct({ listChecked: arrayOrdered }))
                  message.success('Đặt hàng thành công')
                  navigate('/orderSuccess', {
                        state: {
                              delivery,
                              payment,
                              orders: order?.orderItemsSlected,
                              totalPriceMemo: totalPriceMemo
                        }
                  })
            }
      }

      const { isLoading, data } = mutationUpdate
      const { data: dataAdd, isLoading: isLoadingAddOrder, isSuccess, isError } = mutationAddOrder

      useEffect(() => {
            if (isSuccess && dataAdd?.status === 'OK') {

                  message.success('Đặt hàng thành công')

            } else if (isError) {
                  message.error()
            }
      }, [isSuccess, isError])

      useEffect(() => {
            form.setFieldsValue(stateUserDetails)
      }, [form, stateUserDetails])

      useEffect(() => {
            if (isOpenModalUpdateInfo) {
                  setStateUserDetails({
                        city: user?.city,
                        name: user?.name,
                        address: user?.address,
                        phone: user?.phone
                  })
            }
      }, [isOpenModalUpdateInfo])

      const priceMemo = useMemo(() => {
            const result = order?.orderItemsSlected?.reduce((total, cur) => {
                  return total + ((cur.price * cur.amount))
            }, 0)
            return result
      }, [order])

      const priceDiscountMemo = useMemo(() => {
            const result = order?.orderItemsSlected?.reduce((total, cur) => {
                  const totalDiscount = cur.discount ? cur.discount : 0
                  return total + (priceMemo * (totalDiscount * cur.amount) / 100)
            }, 0)
            if (Number(result)) {
                  return result
            }
            return 0
      }, [order])

      const diliveryPriceMemo = useMemo(() => {
            if (priceMemo > 200000) {
                  return 10000
            } else if (priceMemo === 0) {
                  return 0
            } else {
                  return 20000
            }
      }, [priceMemo])

      const totalPriceMemo = useMemo(() => {
            return Number(priceMemo) - Number(priceDiscountMemo) + Number(diliveryPriceMemo)
      }, [priceMemo, priceDiscountMemo, diliveryPriceMemo])

      const handleCancleUpdate = () => {
            setStateUserDetails({
                  name: '',
                  email: '',
                  phone: '',
                  isAdmin: false,
            })
            form.resetFields()
            setIsOpenModalUpdateInfo(false)
      }

      const handleUpdateInforUser = () => {
            const { name, address, city, phone } = stateUserDetails
            if (name && address && city && phone) {
                  mutationUpdate.mutate({ id: user?.id, token: user?.access_token, ...stateUserDetails }, {
                        onSuccess: () => {
                              dispatch(updateUser({ name, address, city, phone }))
                              setIsOpenModalUpdateInfo(false)
                        }
                  })
            }
      }
      const handleOnchangeDetails = (e) => {
            setStateUserDetails({
                  ...stateUserDetails,
                  [e.target.name]: e.target.value
            })
      }
      const handleChangeAddress = () => {
            setIsOpenModalUpdateInfo(true)
      }

      const handleDilivery = (e) => {
            setDelivery(e.target.value)
      }

      const handlePayment = (e) => {
            setPayment(e.target.value)
      }

      const onSuccessPaypal = (details, data) => {
            mutationAddOrder.mutate(
                  {
                        token: user?.access_token,
                        orderItems: order?.orderItemsSlected,
                        fullName: user?.name,
                        address: user?.address,
                        phone: user?.phone,
                        city: user?.city,
                        paymentMethod: payment,
                        itemsPrice: priceMemo,
                        shippingPrice: diliveryPriceMemo,
                        totalPrice: totalPriceMemo,
                        user: user?.id,
                        isPaid: true,
                        paidAt: details.update_time,
                        email: user?.email
                  }

            )
            const arrayOrdered = []
            order?.orderItemsSlected?.forEach(element => {
                  arrayOrdered.push(element.product)
            });
            dispatch(removeAllOrderProduct({ listChecked: arrayOrdered }))
            message.success('Đặt hàng thành công')
            navigate('/orderSuccess', {
                  state: {
                        delivery,
                        payment,
                        orders: order?.orderItemsSlected,
                        totalPriceMemo: totalPriceMemo
                  }
            })
      }
      const addPaypalScript = async () => {
            const { data } = await PaymentService.getConfig()
            const script = document.createElement('script')
            script.type = 'text/javascript'
            script.src = `https://www.paypal.com/sdk/js?client-id=${data}`
            script.async = true;
            script.onload = () => {
                  setSdkReady(true)
            }
            document.body.appendChild(script)
      }

      useEffect(() => {

            if (!window.paypal) {
                  addPaypalScript()
            } else {
                  setSdkReady(true)
            }

      }, [])
      return (
            <div>
                  <HeaderComponent />
                  <div style={{ background: '#f5f5fa', with: '100%', height: '100vh' }}>
                        {/* <Loading isLoading={isLoadingAddOrder}> */}
                        <div style={{ height: '100%', width: '1270px', marginLeft: '260px' }}>
                              <h3 style={{ fontSize: '16px', marginLeft: '10px' }}>THANH TOÁN</h3>
                              <div style={{ display: 'flex', justifyContent: 'center', marginTop: '25px' }}>
                                    <WrapperLeft style={{ marginRight: '10px', }}>
                                          <WrapperInfo style={{ width: '920px' }}>
                                                <div>
                                                      <Lable style={{ fontSize: '16px' }}>Chọn phương thức giao hàng</Lable>
                                                      <WrapperRadio onChange={handleDilivery} value={delivery}>
                                                            <Radio value="fast"><span style={{ color: '#ea8500', fontWeight: 'bold' }}>FAST</span> Giao hàng tiết kiệm</Radio>
                                                            <Radio value="gojek"><span style={{ color: '#ea8500', fontWeight: 'bold' }}>GO_JEK</span> Giao hàng tiết kiệm</Radio>
                                                      </WrapperRadio>
                                                </div>
                                          </WrapperInfo>
                                          <WrapperInfo style={{ width: '920px' }}>
                                                <div>
                                                      <Lable style={{ fontSize: '16px' }}>Chọn phương thức thanh toán</Lable>
                                                      <WrapperRadio onChange={handlePayment} value={payment}>
                                                            <Radio value="later_money"> Thanh toán tiền mặt khi nhận hàng</Radio>
                                                            <Radio value="paypal"> Thanh toán tiền bằng paypal</Radio>
                                                      </WrapperRadio>
                                                </div>
                                          </WrapperInfo>
                                    </WrapperLeft>
                                    <WrapperRight>
                                          <div style={{ width: '100%' }}>
                                                <WrapperInfo>
                                                      <div>
                                                            <span style={{ fontSize: '16px' }}>Giao tới:</span>
                                                            <span onClick={handleChangeAddress} style={{ color: '#9255FD', cursor: 'pointer', fontSize: '16px', marginLeft: '150px' }}>Thay đổi</span><br /><br />
                                                            <span style={{ fontWeight: 'bold', fontSize: '16px' }}>{user.name} | {user.phone} </span><br />
                                                            <span style={{ fontSize: '16px', color: 'rgb(0, 171, 86)', backgroundColor: 'rgb(239, 255, 244)' }}>Nhà </span>
                                                            <span style={{ fontSize: '16px', color: 'rgb(128, 128, 137)' }}>{user.address}, {user.city}</span>
                                                      </div>
                                                </WrapperInfo>
                                                <WrapperInfo>
                                                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                            <span style={{ fontSize: '16px' }}> Tạm tính</span>
                                                            <span style={{ color: '#000', fontSize: '14px', fontWeight: 'bold' }}>{convertPrice(priceMemo)}</span>
                                                      </div>
                                                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                            <span style={{ fontSize: '16px' }}>Giảm giá</span>
                                                            <span style={{ color: '#000', fontSize: '14px', fontWeight: 'bold' }}>-{convertPrice(priceDiscountMemo)}</span>
                                                      </div>
                                                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                            <span style={{ fontSize: '16px' }}>Phí giao hàng</span>
                                                            <span style={{ color: '#000', fontSize: '14px', fontWeight: 'bold' }}>{convertPrice(diliveryPriceMemo)}</span>
                                                      </div>
                                                </WrapperInfo>
                                                <WrapperTotal style={{ width: '320px' }}>
                                                      <span style={{ fontSize: '16px' }}>Tổng tiền</span>
                                                      <span style={{ display: 'flex', flexDirection: 'column' }}>
                                                            <span style={{ color: 'rgb(254, 56, 52)', fontSize: '24px', fontWeight: 'bold' }}>{convertPrice(totalPriceMemo)}</span>
                                                            <span style={{ color: '#000', fontSize: '11px', fontSize: '16px' }}>(Đã bao gồm VAT nếu có)</span>
                                                      </span>
                                                </WrapperTotal>
                                          </div>
                                          {payment === 'paypal' ? (
                                                <div style={{ width: '320px' }}>
                                                      <PayPalButton
                                                            amount={Math.round(totalPriceMemo / 25000)}
                                                            // shippingPreference="NO_SHIPPING" // default is "GET_FROM_FILE"
                                                            onSuccess={onSuccessPaypal}
                                                            onError={() => {
                                                                  alert('Thanh toán thất bại')
                                                            }}
                                                      />
                                                </div>
                                          ) : (
                                                <ButtonComponent
                                                      onClick={() => handleAddOrder()}
                                                      size={40}
                                                      styleButton={{
                                                            background: 'rgb(255, 57, 69)',
                                                            height: '48px',
                                                            width: '320px',
                                                            border: 'none',
                                                            borderRadius: '4px',
                                                            marginLeft: '0px'
                                                      }}
                                                      textbutton={'Đặt hàng'}
                                                      styleTextButton={{ color: '#fff', fontSize: '15px', fontWeight: '700' }}
                                                ></ButtonComponent>
                                          )}
                                    </WrapperRight>
                              </div>
                        </div>
                        <ModalComponent title="Cập nhật thông tin giao hàng" open={isOpenModalUpdateInfo} onCancel={handleCancleUpdate} onOk={handleUpdateInforUser} >
                              <Loading isLoading={isLoading}>
                                    <Form
                                          name="basic"
                                          labelCol={{ span: 4 }}
                                          wrapperCol={{ span: 20 }}
                                          // onFinish={onUpdateUser}
                                          autoComplete="on"
                                          form={form}

                                    >
                                          <Form.Item
                                                label="Name"
                                                name="name"
                                                rules={[{ required: true, message: 'Please input your name!' }]}
                                          >
                                                <Input name="name" value={stateUserDetails['name']} onChange={handleOnchangeDetails} />
                                          </Form.Item>
                                          <Form.Item
                                                label="City"
                                                name="city"
                                                rules={[{ required: true, message: 'Please input your city!' }]}
                                          >
                                                <Input name="city" value={stateUserDetails['city']} onChange={handleOnchangeDetails} />
                                          </Form.Item>
                                          <Form.Item
                                                label="Phone"
                                                name="phone"
                                                rules={[{ required: true, message: 'Please input your  phone!' }]}
                                          >
                                                <Input name="phone" value={stateUserDetails.phone} onChange={handleOnchangeDetails} />
                                          </Form.Item>

                                          <Form.Item
                                                label="Adress"
                                                name="address"
                                                rules={[{ required: true, message: 'Please input your  address!' }]}
                                          >
                                                <Input name="address" value={stateUserDetails.address} onChange={handleOnchangeDetails} />
                                          </Form.Item>
                                    </Form>
                              </Loading>
                        </ModalComponent>
                        {/* </Loading> */}
                  </div>
            </div>
      )
}

export default PaymentPage
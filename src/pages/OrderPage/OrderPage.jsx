import React, { useEffect, useMemo, useState } from 'react'
import HeaderComponent from '../../components/HeaderComponent/HeaderComponent'
import { CustomCheckbox, WrapperCountOrder, WrapperInfo, WrapperItemOrder, WrapperLeft, WrapperListOrder, WrapperRight, WrapperStyleHeader, WrapperStyleHeaderDilivery, WrapperTotal } from './style'
import { Form, Input } from 'antd'
import ModalComponent from '../../components/ModalComponent/ModalComponent'
import { DeleteOutlined, MinusOutlined, PlusOutlined } from '@ant-design/icons'
import { WrapperInputNumber } from '../../components/ProductDetailsComponent/Style'
import ButtonComponent from '../../components/ButtonComponen/ButtonComponen'
import { useDispatch, useSelector } from 'react-redux'
import StepComponent from '../../components/StepComponent/StepComponent'
import { decreaseAmount, increaseAmount, removeAllOrderProduct, removeOrderProduct, selectedOrder } from '../../dux/slides/orderSlide'
import { convertPrice } from '../../utils'
import { useNavigate } from 'react-router-dom'
import * as message from '../../components/Message/Message'
import { updateUser } from '../../dux/slides/userSlide'
import * as UserService from '../../services/UserServices'
import { useMutationHooks } from '../../hooks/useMutationHook'
import Loading from '../../components/LoadingComponent/Loading'

const OrderPage = () => {
      const order = useSelector((state) => state.order)
      const user = useSelector((state) => state.user)
      const dispatch = useDispatch()
      const [listChecked, setListChecked] = useState([])
      const [isOpenModalUpdateInfo, setIsOpenModalUpdateInfo] = useState(false)
      const navigate = useNavigate()
      const [form] = Form.useForm();
      const [stateUserDetails, setStateUserDetails] = useState({
            name: '',
            phone: '',
            address: '',
            city: ''
      })

      const itemsDelivery = [
            {
                  title: '20.000 VND',
                  description: 'Dưới 200.000 VND',
            },
            {
                  title: '10.000 VND',
                  description: 'Từ 200.000 VND đến dưới 500.000 VND',
            },
            {
                  title: 'Free ship',
                  description: 'Trên 500.000 VND',
            },
      ]

      const handleChangeCount = (type, idProduct, limited) => {
            if (type === 'increase') {
                  if (!limited) {
                        dispatch(increaseAmount({ idProduct }))
                  }
            } else {
                  if (!limited) {
                        dispatch(decreaseAmount({ idProduct }))
                  }
            }
      }

      const onChange = (e) => {
            if (listChecked.includes(e.target.value)) {
                  const newListChecked = listChecked.filter((item) => item !== e.target.value)
                  setListChecked(newListChecked)
            } else {
                  setListChecked([...listChecked, e.target.value])
            }

      }

      const handleOnChangeCheckAll = (e) => {
            if (e.target.checked) {
                  const newListChecked = []
                  order?.orderItems?.forEach((item) => {
                        newListChecked.push(item?.product)
                  })
                  setListChecked(newListChecked)
            } else {
                  setListChecked([])
            }
      }

      const handleDeleteOrder = (idProduct) => {
            dispatch(removeOrderProduct({ idProduct }))
      }

      const handleRemoveAllOrder = () => {
            if (listChecked.length > 0) {
                  dispatch(removeAllOrderProduct({ listChecked }))
            }

      }

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
            if (priceMemo >= 20000 && priceMemo < 500000) {
                  return 10000
            } else if (priceMemo >= 500000 || order?.orderItemsSlected?.length === 0) {
                  return 0
            } else {
                  return 20000
            }
      }, [priceMemo])

      const totalPriceMemo = useMemo(() => {
            return Number(priceMemo) - Number(priceDiscountMemo) + Number(diliveryPriceMemo)
      }, [priceMemo, priceDiscountMemo, diliveryPriceMemo])

      useEffect(() => {
            dispatch(selectedOrder({ listChecked }))
      }, [listChecked])

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

      const handleAddCard = () => {
            if (!order?.orderItemsSlected?.length) {
                  message.error('Vui lòng chọn sản phẩm')
            } else if (!user?.phone || !user.address || !user.name || !user.city) {
                  setIsOpenModalUpdateInfo(true)
            } else {
                  navigate('/payment')
            }
      }

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

      const { isLoading, data } = mutationUpdate

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

      return (
            <div>
                  <HeaderComponent />
                  <div style={{ background: '#f5f5fa', width: '100%', height: '100vh' }}>
                        <div style={{ height: '100%', width: '1270px', marginLeft: '265px' }}>
                              <h1 style={{ fontWeight: 'bold', marginLeft: '10px' }}>GIỎ HÀNG</h1>
                              <div style={{ display: 'flex', justifyContent: 'center' }}>
                                    <WrapperLeft style={{ marginTop: '25px' }}>
                                          <h1>Phí giao hàng</h1>
                                          <WrapperStyleHeaderDilivery>
                                                <StepComponent items={itemsDelivery} current={diliveryPriceMemo === 10000
                                                      ? 2 : diliveryPriceMemo === 20000 ? 1
                                                            : order.orderItemsSlected.length === 0 ? 0 : 3} />
                                          </WrapperStyleHeaderDilivery>
                                          <WrapperStyleHeader>
                                                <span style={{ display: 'inline-block', width: '390px' }}>
                                                      <CustomCheckbox onChange={handleOnChangeCheckAll} checked={listChecked.length === order?.orderItems?.length}></CustomCheckbox>
                                                      <span style={{ fontSize: '16px', marginLeft: '10px' }}> Tất cả ( {order?.orderItems?.length} sản phẩm)</span>
                                                </span>
                                                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                      <span style={{ fontSize: '16px' }}>Đơn giá</span>
                                                      <span style={{ fontSize: '16px' }}>Số lượng</span>
                                                      <span style={{ fontSize: '16px' }}>Thành tiền</span>
                                                      <DeleteOutlined style={{ cursor: 'pointer', fontSize: '16px' }} onClick={handleRemoveAllOrder} />
                                                </div>
                                          </WrapperStyleHeader>
                                          <WrapperListOrder>
                                                {order?.orderItems?.map((order) => {
                                                      return (
                                                            <WrapperItemOrder >
                                                                  <div style={{ width: '390px', display: 'flex', alignItems: 'center', gap: 4 }}>
                                                                        <CustomCheckbox onChange={onChange} value={order?.product} checked={listChecked.includes(order?.product)}></CustomCheckbox>
                                                                        <img src={order?.image} style={{ width: '77px', height: '79px', objectFit: 'cover', marginLeft: '10px', borderRadius: '10px' }} />
                                                                        <div style={{
                                                                              width: 260,
                                                                              overflow: 'hidden',
                                                                              textOverflow: 'ellipsis',
                                                                              whiteSpace: 'nowrap',
                                                                              fontSize: '16px',
                                                                              marginLeft: '10px'
                                                                        }}> {order?.name}</div>
                                                                  </div>
                                                                  <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                                        <span>
                                                                              <span style={{ fontSize: '16px', color: '#242424', }}>{convertPrice(order.price)}</span>
                                                                        </span>
                                                                        <WrapperCountOrder>
                                                                              <button style={{ border: 'none', background: 'transparent', cursor: 'pointer' }} onClick={() => handleChangeCount('decrease', order?.product, order?.amount === 1)}>
                                                                                    <MinusOutlined style={{ color: '#000', fontSize: '10px' }} />
                                                                              </button>
                                                                              <WrapperInputNumber defaultValue={order?.amount} value={order?.amount} size="small" min={1} max={order?.countInstock} />
                                                                              <button style={{ border: 'none', background: 'transparent', cursor: 'pointer' }} onClick={() => handleChangeCount('increase', order?.product, order?.amount === order.countInstock, order?.amount === 1)} >
                                                                                    <PlusOutlined style={{ color: '#000', fontSize: '10px' }} />
                                                                              </button>
                                                                        </WrapperCountOrder>
                                                                        <span style={{ color: 'rgb(255, 66, 78)', fontSize: '16px', fontWeight: 500 }}>{convertPrice(order?.price * order.amount)}</span>
                                                                        <DeleteOutlined style={{ cursor: 'pointer', fontSize: '16px' }} onClick={() => handleDeleteOrder(order?.product)} />
                                                                  </div>
                                                            </WrapperItemOrder>
                                                      )
                                                })}
                                          </WrapperListOrder>
                                    </WrapperLeft>
                                    <WrapperRight>
                                          <div style={{ width: '100%', marginTop: '50px' }}>
                                                <WrapperInfo>
                                                      <div>
                                                            <span style={{ fontSize: '16px' }}>Giao tới: </span>
                                                            <span onClick={handleChangeAddress} style={{ color: '#9255FD', cursor: 'pointer', fontSize: '16px', marginLeft: '150px' }}> Thay đổi</span><br /><br />
                                                            <span style={{ fontWeight: 'bold', fontSize: '16px', color: 'rgb(56, 56, 61)' }}>{user.name} | {user.phone}</span><br />
                                                            <span style={{ fontSize: '16px', color: 'rgb(0, 171, 86)', backgroundColor: 'rgb(239, 255, 244)' }}>Nhà </span>
                                                            <span style={{ fontSize: '16px', color: 'rgb(128, 128, 137)' }}>{user.address}, {user.city}</span>
                                                      </div>
                                                </WrapperInfo>
                                                <WrapperInfo>
                                                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                            <span style={{ fontSize: '16px' }}>Tạm tính</span>
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
                                          <ButtonComponent
                                                onClick={() => handleAddCard()}
                                                size={40}
                                                styleButton={{
                                                      background: 'rgb(255, 57, 69)',
                                                      height: '48px',
                                                      width: '320px',
                                                      border: 'none',
                                                      borderRadius: '4px',
                                                      marginLeft: '0px'
                                                }}
                                                textbutton={'Mua hàng'}
                                                styleTextButton={{ color: '#fff', fontSize: '15px', fontWeight: '700' }}
                                          ></ButtonComponent>
                                    </WrapperRight>
                              </div>
                        </div>
                        <ModalComponent title="Cập nhật thông tin giao hàng" open={isOpenModalUpdateInfo} onCancel={handleCancleUpdate} onOk={handleUpdateInforUser}>
                              <Loading isLoading={isLoading}>
                                    <Form
                                          name="basic"
                                          labelCol={{ span: 6 }}
                                          wrapperCol={{ span: 20 }}
                                          // onFinish={onUpdateUser}
                                          autoComplete="on"
                                          form={form}

                                    >
                                          <Form.Item
                                                label="Tên"
                                                name="name"
                                                rules={[{ required: true, message: 'Please input your name!' }]}
                                          >
                                                <Input name="name" value={stateUserDetails['name']} onChange={handleOnchangeDetails} />
                                          </Form.Item>
                                          <Form.Item
                                                label="Tỉnh/Thành phố"
                                                name="city"
                                                rules={[{ required: true, message: 'Please input your city!' }]}
                                          >
                                                <Input name="city" value={stateUserDetails['city']} onChange={handleOnchangeDetails} />
                                          </Form.Item>
                                          <Form.Item
                                                label="Số điện thoại"
                                                name="phone"
                                                rules={[{ required: true, message: 'Please input your  phone!' }]}
                                          >
                                                <Input name="phone" value={stateUserDetails.phone} onChange={handleOnchangeDetails} />
                                          </Form.Item>

                                          <Form.Item
                                                label="Địa chỉ"
                                                name="address"
                                                rules={[{ required: true, message: 'Please input your  address!' }]}
                                          >
                                                <Input name="address" value={stateUserDetails.address} onChange={handleOnchangeDetails} />
                                          </Form.Item>
                                    </Form>
                              </Loading>
                        </ModalComponent>
                  </div>
            </div>
      )
}

export default OrderPage
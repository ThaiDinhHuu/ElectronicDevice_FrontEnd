import React, { useEffect, useState } from 'react'
import HeaderComponent from '../../components/HeaderComponent/HeaderComponent'
import { WrapperContentProfile, WrapperHeader, WrapperInput, WrapperLabel, WrapperUploadFile } from './style'
import Loading from '../../components/LoadingComponent/Loading'
import InputForm from '../../components/InputForm/InputForm'
import ButtonComponent from '../../components/ButtonComponen/ButtonComponen'
import { Button } from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import { useDispatch, useSelector } from 'react-redux'
import { useMutationHooks } from '../../hooks/useMutationHook'
import * as UserServices from "../../services/UserServices"
import * as Message from "../../components/Message/Message"
import { updateUser } from "../../dux/slides/userSlide"
import { getBase64 } from '../../utils'

export const ProfilePage = () => {
      const user = useSelector((state) => state.user)
      const [email, setEmail] = useState('')
      const [name, setName] = useState('')
      const [phone, setPhone] = useState('')
      const [avatar, setAvatar] = useState('')
      const [address, setAddress] = useState('')
      const mutation = useMutationHooks(
            (data) => {
                  const { id, access_token, ...rests } = data
                  UserServices.updateUser(id, rests, access_token)
            }
      )
      const { data, isLoading, isSuccess, isError } = mutation
      const dispatch = useDispatch()

      const handleOnchangeEmail = (value) => {
            setEmail(value)
      }
      const handleOnchangeName = (value) => {
            setName(value)
      }
      const handleOnchangePhone = (value) => {
            setPhone(value)
      }
      const handleOnchangeAddress = (value) => {
            setAddress(value)
      }
      const handleOnchangeAvatar = async ({ fileList }) => {
            const file = fileList[0]
            if (!file.url && !file.preview) {
                  file.preview = await getBase64(file.originFileObj);
            }
            setAvatar(file.preview)
      }
      const handleUpdate = () => {
            mutation.mutate({ id: user?.id, email, name, phone, address, avatar, access_token: user?.access_token })

      }
      useEffect(() => {
            setEmail(user?.email)
            setName(user?.name)
            setPhone(user?.phone)
            setAddress(user?.address)
            setAvatar(user?.avatar)
      }, [user])
      const handleGetDetailsUser = async (id, token) => {
            const res = await UserServices.getDetailsUser(id, token)
            dispatch(updateUser({ ...res?.data, access_token: token }))
      }
      useEffect(() => {
            if (isSuccess) {
                  Message.success()
                  handleGetDetailsUser(user?.id, user?.access_token)
            } else if (isError) {
                  Message.error()
            }
      }, [isSuccess, isError])
      return (
            <div>
                  <HeaderComponent />
                  <div style={{ width: '1270px', margin: '0 auto', height: '500px' }}>
                        <WrapperHeader>Thông tin người dùng</WrapperHeader>
                        <Loading isLoading={isLoading}>
                              <WrapperContentProfile>
                                    <WrapperInput>
                                          <WrapperLabel htmlFor="name">Name</WrapperLabel>
                                          <InputForm style={{ width: '300px' }} id="name" value={name} onChange={handleOnchangeName} />
                                          <ButtonComponent
                                                onClick={handleUpdate}
                                                size={40}
                                                styleButton={{
                                                      height: '30px',
                                                      width: 'fit-content',
                                                      borderRadius: '4px',
                                                      padding: '2px 6px 6px'
                                                }}
                                                textbutton={'Cập nhật'}
                                                styleTextButton={{ color: 'rgb(26, 148, 255)', fontSize: '15px', fontWeight: '700' }}
                                          ></ButtonComponent>
                                    </WrapperInput>
                                    <WrapperInput>
                                          <WrapperLabel htmlFor="email">Email</WrapperLabel>
                                          <InputForm style={{ width: '300px' }} id="email" value={email} onChange={handleOnchangeEmail} />
                                          <ButtonComponent
                                                onClick={handleUpdate}
                                                size={40}
                                                styleButton={{
                                                      height: '30px',
                                                      width: 'fit-content',
                                                      borderRadius: '4px',
                                                      padding: '2px 6px 6px'
                                                }}
                                                textbutton={'Cập nhật'}
                                                styleTextButton={{ color: 'rgb(26, 148, 255)', fontSize: '15px', fontWeight: '700' }}
                                          ></ButtonComponent>
                                    </WrapperInput>
                                    <WrapperInput>
                                          <WrapperLabel htmlFor="phone">Phone</WrapperLabel>
                                          <InputForm style={{ width: '300px' }} id="email" value={phone} onChange={handleOnchangePhone} />
                                          <ButtonComponent
                                                onClick={handleUpdate}
                                                size={40}
                                                styleButton={{
                                                      height: '30px',
                                                      width: 'fit-content',
                                                      borderRadius: '4px',
                                                      padding: '2px 6px 6px'
                                                }}
                                                textbutton={'Cập nhật'}
                                                styleTextButton={{ color: 'rgb(26, 148, 255)', fontSize: '15px', fontWeight: '700' }}
                                          ></ButtonComponent>
                                    </WrapperInput>
                                    <WrapperInput>
                                          <WrapperLabel htmlFor="avatar">Avatar</WrapperLabel>
                                          <WrapperUploadFile onChange={handleOnchangeAvatar} maxCount={1}>
                                                <Button icon={<UploadOutlined />}>Select File</Button>
                                          </WrapperUploadFile >
                                          {avatar && (
                                                <img style={{
                                                      height: '60px',
                                                      width: '60px',
                                                      borderRadius: '50%',
                                                      objectFit: 'cover'
                                                }} alt="avatar" src={avatar} />
                                          )}
                                          {/* <InputForm style={{ width: '300px' }} id="avatar" value={avatar} onChange={handleOnchangeAvatar} /> */}
                                          <ButtonComponent
                                                onClick={handleUpdate}
                                                size={40}
                                                styleButton={{
                                                      height: '30px',
                                                      width: 'fit-content',
                                                      borderRadius: '4px',
                                                      padding: '2px 6px 6px'
                                                }}
                                                textbutton={'Cập nhật'}
                                                styleTextButton={{ color: 'rgb(26, 148, 255)', fontSize: '15px', fontWeight: '700' }}
                                          ></ButtonComponent>
                                    </WrapperInput>
                                    <WrapperInput>
                                          <WrapperLabel htmlFor="address">Address</WrapperLabel>
                                          <InputForm style={{ width: '300px' }} id="address" value={address} onChange={handleOnchangeAddress} />
                                          <ButtonComponent
                                                onClick={handleUpdate}
                                                size={40}
                                                styleButton={{
                                                      height: '30px',
                                                      width: 'fit-content',
                                                      borderRadius: '4px',
                                                      padding: '2px 6px 6px'
                                                }}
                                                textbutton={'Cập nhật'}
                                                styleTextButton={{ color: 'rgb(26, 148, 255)', fontSize: '15px', fontWeight: '700' }}
                                          ></ButtonComponent>
                                    </WrapperInput>
                              </WrapperContentProfile>
                        </Loading>
                  </div>
            </div>
      )
}

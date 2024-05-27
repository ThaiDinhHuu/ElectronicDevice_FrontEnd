import React, { useEffect } from 'react'
import { WrapperContainerLeft, WrapperContainerRight, WrapperTextLight } from './Style'
import { Button, Image, message } from 'antd'
import imageLogo from '../../assets/images/logo-login.png'
import InputForm from '../../components/InputForm/InputForm.jsx'
import { EyeFilled, EyeInvisibleFilled } from '@ant-design/icons'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import * as UserServices from "../../services/UserServices"
import { useMutationHooks } from '../../hooks/useMutationHook'
import Loading from '../../components/LoadingComponent/Loading'
import * as Message from "../../components/Message/Message"

const SignUpPage = () => {
      const navigate = useNavigate()

      const mutation = useMutationHooks(
            data => UserServices.signupUser(data)
      )
      const { data, isLoading, isError, isSuccess } = mutation;

      useEffect(() => {
            if (data?.status === 'ok') {
                  Message.success()
                  handleNavigateSignIn()
            } else if (data?.status === 'ERR') {
                  Message.error()
            }
      }, [isError, isSuccess])

      const [isShowPassword, setIsShowPassword] = useState(false)
      const [isShowConfirmPassword, setIsShowConfirmPassword] = useState(false)
      const [email, setEmail] = useState('');
      const [password, setPassword] = useState('');
      const [confirmPassword, setConfirmPassword] = useState('');

      const handleOnchangeEmail = (value) => {
            setEmail(value)
      }

      const handleOnchangePassword = (value) => {
            setPassword(value)
      }

      const handleOnchangeConfirmPassword = (value) => {
            setConfirmPassword(value)
      }

      const handleNavigateSignIn = () => {
            navigate('/sign-in')
      }

      const handleSignUp = () => {
            mutation.mutate({ email, password, confirmPassword })
            console.log('sign up:', email, password, confirmPassword)
      }

      return (
            <div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0, 0, 0, 0.53)', height: '100vh' }}>
                        <div style={{ width: '800px', height: '445px', borderRadius: '20px', background: '#fff', display: 'flex' }}>
                              <WrapperContainerLeft>
                                    <h1>Xin chào</h1><br />
                                    <p style={{ fontSize: '14px' }}>Đăng nhập vào tạo tài khoản</p><br />
                                    <InputForm style={{ marginBottom: '10px' }} placeholder="abc@gmail.com" value={email} onChange={handleOnchangeEmail} />
                                    <div style={{ position: 'relative' }}>
                                          <span
                                                onClick={() => setIsShowPassword(!isShowPassword)}
                                                style={{
                                                      zIndex: 10,
                                                      position: 'absolute',
                                                      top: '4px',
                                                      right: '8px'
                                                }}
                                          >{
                                                      isShowPassword ? (
                                                            <EyeFilled />
                                                      ) : (
                                                            <EyeInvisibleFilled />
                                                      )
                                                }
                                          </span>
                                          <InputForm placeholder="password" style={{ marginBottom: '10px' }} type={isShowPassword ? "text" : "password"}
                                                value={password} onChange={handleOnchangePassword}
                                          />
                                    </div>
                                    <div style={{ position: 'relative' }}>
                                          <span
                                                onClick={() => setIsShowConfirmPassword(!isShowConfirmPassword)}
                                                style={{
                                                      zIndex: 10,
                                                      position: 'absolute',
                                                      top: '4px',
                                                      right: '8px'
                                                }}
                                          >{
                                                      isShowConfirmPassword ? (
                                                            <EyeFilled />
                                                      ) : (
                                                            <EyeInvisibleFilled />
                                                      )
                                                }
                                          </span>
                                          <InputForm placeholder="comfirm password" type={isShowConfirmPassword ? "text" : "password"}
                                                value={confirmPassword} onChange={handleOnchangeConfirmPassword}
                                          />
                                    </div>
                                    {data?.status === 'ERR' && <span style={{ color: 'red' }}>{data?.message}</span>}
                                    <Loading isLoading={isLoading}>
                                          <Button
                                                disabled={!email.length || !password.length || !confirmPassword.length}
                                                onClick={handleSignUp}
                                                size={40}
                                                style={{
                                                      background: 'rgb(255, 57, 69)',
                                                      height: '48px',
                                                      width: '100%',
                                                      border: 'none',
                                                      borderRadius: '4px',
                                                      margin: '26px 0 10px'
                                                }}


                                          ><span style={{ color: '#fff', fontSize: '15px', fontWeight: '700' }}>Đăng ký</span></Button><br />
                                    </Loading>
                                    <p style={{ fontSize: '14px' }}>Bạn đã có tài khoản? <WrapperTextLight onClick={handleNavigateSignIn} style={{ cursor: 'pointer' }}> Đăng nhập</WrapperTextLight></p>
                              </WrapperContainerLeft>
                              <WrapperContainerRight style={{ borderTopRightRadius: '30px', borderBottomRightRadius: '30px', }}>
                                    <Image src={imageLogo} preview={false} alt="iamge-logo" height="203px" width="203px" />
                                    <h2 style={{ color: 'rgb(11, 116, 229)' }}>Mua sắm tại TDH</h2>
                              </WrapperContainerRight>
                        </div>
                  </div >
            </div>
      )
}

export default SignUpPage
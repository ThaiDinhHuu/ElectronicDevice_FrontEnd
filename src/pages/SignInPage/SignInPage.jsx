import React, { useEffect } from 'react'
import { WrapperContainerLeft, WrapperContainerRight, WrapperTextLight } from './Style'
import { Button, Image } from 'antd'
import imageLogo from '../../assets/images/logo-login.png'
import InputForm from '../../components/InputForm/InputForm'
import { EyeFilled, EyeInvisibleFilled } from '@ant-design/icons'
import { useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react'
import * as UserServices from "../../services/UserServices"
import { useMutationHooks } from '../../hooks/useMutationHook'
import Loading from '../../components/LoadingComponent/Loading'
import * as Message from "../../components/Message/Message"
import jwt_decode from "jwt-decode";
import { useDispatch, useSelector } from 'react-redux'
import { updateUser } from '../../dux/slides/userSlide'


const SignInPage = () => {
      const navigate = useNavigate()
      const dispatch = useDispatch();
      const location = useLocation()
      const user = useSelector((state) => state.user)

      const mutation = useMutationHooks(
            data => UserServices.loginUser(data)
      )

      const { data, isLoading, isError, isSuccess } = mutation;

      useEffect(() => {
            if (data?.status === 'ok') {
                  if (location?.state) {
                        navigate(location?.state)
                  } else {
                        navigate('/')
                  }
                  Message.success('Đăng nhập thành công')

                  localStorage.setItem('access_token', JSON.stringify(data?.access_token))
                  if (data?.access_token) {
                        const decoded = jwt_decode(data?.access_token)
                        console.log('decoded', decoded)
                        if (decoded?.id) {
                              handleGetDetailsUser(decoded?.id, data?.access_token)
                        }
                  }
            } else if (data?.status === 'ERR') {
                  Message.error()
            }
      }, [isError, isSuccess])

      const handleGetDetailsUser = async (id, token) => {

            const res = await UserServices.getDetailsUser(id, token)
            console.log('res', res)
            dispatch(updateUser({ ...res?.data, access_token: token }))

      }

      console.log('mutation', mutation)

      const [email, setEmail] = useState('');
      const [password, setPassword] = useState('');

      const handleOnchangeEmail = (value) => {
            setEmail(value)
      }

      const handleOnchangePassword = (value) => {
            setPassword(value)
      }
      const handleSignIn = () => {
            mutation.mutate({
                  email, password
            })

      }

      const handleNavigateSignUp = () => {

            navigate('/sign-up')
      }
      const [isShowPassword, setIsShowPassword] = useState(false)
      return (
            <div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0, 0, 0, 0.53)', height: '100vh' }}>
                        <div style={{ width: '800px', height: '445px', borderRadius: '20px', background: '#fff', display: 'flex' }}>
                              <WrapperContainerLeft>
                                    <h1>Xin chào</h1><br />
                                    <p style={{ fontSize: '15px' }}>Đăng nhập hoặc Tạo tài khoản</p><br />
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
                                          <InputForm
                                                placeholder="password"
                                                type={isShowPassword ? "text" : "password"}
                                                value={password} onChange={handleOnchangePassword}

                                          />
                                    </div>
                                    {data?.status === 'ERR' && <span style={{ color: 'red' }}>{data?.message}</span>}
                                    <Loading isLoading={isLoading}>
                                          <Button
                                                disabled={!email.length || !password.length}
                                                onClick={handleSignIn}
                                                size={40}
                                                style={{
                                                      background: 'rgb(255, 57, 69)',
                                                      height: '48px',
                                                      width: '100%',
                                                      border: 'none',
                                                      borderRadius: '4px',
                                                      margin: '26px 0 10px'
                                                }}


                                          ><span style={{ color: '#fff', fontSize: '15px', fontWeight: '700' }}>Đăng nhập</span></Button><br />
                                    </Loading>
                                    <p><WrapperTextLight>Quên mật khẩu?</WrapperTextLight></p><br />
                                    <p style={{ fontSize: '14px' }}>Chưa có tài khoản? <WrapperTextLight onClick={handleNavigateSignUp}> Tạo tài khoản</WrapperTextLight></p>
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

export default SignInPage
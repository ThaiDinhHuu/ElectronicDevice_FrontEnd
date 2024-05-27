import React, { useEffect, useState } from 'react'
import { Badge, Col, Popover } from 'antd';
import { WarapperHeader, WarapperText, WarapperHeaderAccount, WarapperTextSmall, WrapperContentPopup } from "./Style"
import Search from 'antd/es/input/Search';
import {
      UserOutlined,
      CaretDownOutlined,
      ShoppingCartOutlined

} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import * as UserServices from "../../services/UserServices"
import ButttonInputSearch from '../ButtonInputSearch/ButttonInputSearch';
import { searchProduct } from '../../dux/slides/productSlide'
import { resetUser } from '../../dux/slides/userSlide'
import Loading from '../LoadingComponent/Loading'

const HeaderComponent = ({ isHiddenSearch = false, isHiddenCart = false }) => {

      const navigate = useNavigate()
      const [userName, setUserName] = useState('')
      const [userAvatar, setUserAvatar] = useState('')
      const [loading, setLoading] = useState(false)
      const [search, setSearch] = useState('')
      const user = useSelector((state) => state.user)
      const dispatch = useDispatch()
      const order = useSelector((state) => state.order)
      const handleNavigateLogin = () => {
            navigate('/sign-in')
      }



      const handleLogOut = async () => {
            setLoading(true)
            await UserServices.logoutUser()
            dispatch(resetUser())
            setLoading(false)
      }

      const handleClickNavigate = () => {

      }
      useEffect(() => {
            setLoading(true)
            setUserName(user?.name)
            setUserAvatar(user?.avatar)
            setLoading(false)
      }, [user?.name, user?.avatar])

      const onSearch = (e) => {
            setSearch(e.target.value)
            dispatch(searchProduct(e.target.value))
      }

      const content = (
            <div>
                  {user?.isAdmin && (

                        <WrapperContentPopup onClick={() => navigate("/system/admin")}>Quản lí hệ thống</WrapperContentPopup>
                  )}

                  <WrapperContentPopup onClick={() => navigate("/profile")}>Thông tin người dùng</WrapperContentPopup>
                  <WrapperContentPopup onClick={() => navigate("/myOrder", { state: { id: user?.id, token: user?.access_token } })}>Đơn hàng</WrapperContentPopup>
                  <WrapperContentPopup onClick={handleLogOut}>Đăng xuất</WrapperContentPopup>
            </div>
      )
      return (
            <div>
                  <WarapperHeader gutter={16} style={{ justifyContent: isHiddenSearch && isHiddenSearch ? 'space-between' : 'unset' }}>
                        <Col span={6}>
                              <WarapperText onClick={() => navigate("/")} style={{ marginTop: "10px", marginLeft: '150px', cursor: 'pointer' }}>TDH</WarapperText>
                        </Col>
                        {!isHiddenSearch && (
                              <Col span={12} >
                                    <ButttonInputSearch
                                          placeholder="Bạn cần tìm gì?"
                                          allowClear
                                          textbutton="Tìm kiếm"
                                          size="large"
                                          onChange={onSearch}
                                    />
                              </Col>
                        )}
                        <Col span={6} style={{ display: 'flex', gap: '10px' }}>
                              <Loading isLoading={loading}>
                                    <WarapperHeaderAccount>
                                          {userAvatar ? (
                                                <img src={userAvatar} alt="avatar" style={{
                                                      height: '30px',
                                                      width: '30px',
                                                      borderRadius: '50%',
                                                      objectFit: 'cover'
                                                }} />
                                          ) : (
                                                <UserOutlined style={{ fontSize: '30px' }} />
                                          )}
                                          {user?.access_token ? (
                                                <>
                                                      <Popover content={content} trigger="click" >
                                                            <div style={{ cursor: 'pointer' }}>{userName?.length ? userName : user?.email}</div>
                                                      </Popover>
                                                </>
                                          ) : (
                                                <div onClick={handleNavigateLogin} style={{ cursor: 'pointer' }}>
                                                      <WarapperTextSmall >Đăng nhập/Đăng ký</WarapperTextSmall>
                                                      <div>
                                                            <WarapperTextSmall>Tài khoản</WarapperTextSmall>
                                                            <CaretDownOutlined />
                                                      </div>
                                                </div>
                                          )}

                                    </WarapperHeaderAccount>
                              </Loading>
                              <div>
                                    {!isHiddenCart && (
                                          <div onClick={() => navigate('/order')} style={{ cursor: 'pointer' }}>
                                                <Badge count={order?.orderItems?.length} size='small'>
                                                      <ShoppingCartOutlined style={{ fontSize: '30px', color: '#fff' }} />
                                                </Badge>

                                                <WarapperTextSmall>Giỏ hàng</WarapperTextSmall>
                                          </div>
                                    )}

                              </div>

                        </Col>
                  </WarapperHeader>
            </div>
      )
}

export default HeaderComponent
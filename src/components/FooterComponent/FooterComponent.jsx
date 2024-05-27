import { MDBCol, MDBContainer, MDBFooter, MDBIcon, MDBRow } from 'mdb-react-ui-kit'
import React from 'react'
import './style.css'

const FooterComponent = () => {
      return (
            <footer>
                  <div class="container">
                        <div class="row">
                              <div class="col-md-4">
                                    <h4>Thông Tin Liên Hệ</h4>
                                    <p>Địa chỉ: 166/2f Trần Văn Dư, Tân Bình, TP Hồ Chí Minh</p>
                                    <p>Email: huunl2002@gmail.com</p>
                                    <p>Điện thoại: +84901074402</p>
                              </div>
                              <div class="col-md-4">
                                    <h4>Danh Mục Sản Phẩm</h4>
                                    <ul>
                                          <li><a href="#">Điện thoại di động</a></li>
                                          <li><a href="#">Laptop</a></li>
                                          <li><a href="#">Phụ kiện</a></li>

                                    </ul>
                              </div>
                              <div class="col-md-4">
                                    <h4>Kết Nối Với Chúng Tôi</h4>

                                    <ul class="social-icons">
                                          <li> <a href="#" target="_blank"><i class="fa fa-facebook"></i></a></li>
                                          <li><a href="#" target="_blank"><i class="fa fa-twitter"></i></a></li>
                                          <li><a href="#" target="_blank"><i class="fa fa-linkedin"></i></a></li>
                                          <li><a href="#" target="_blank"><i class="fa fa-instagram"></i></a></li>

                                    </ul>
                              </div>
                        </div>
                        <div class="row">
                              <div class="col-md-12">
                                    <p class="text-center">© 2023 Tên Công Ty. Bảo lưu mọi quyền.</p>
                              </div>
                        </div>
                  </div>
            </footer>
      )
}

export default FooterComponent
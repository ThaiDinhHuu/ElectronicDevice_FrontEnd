import React, { Fragment, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import DefaultComponent from './components/DefaultComponent/DefaultComponent'
import { routes } from './routes'
import axios from 'axios'
import { useQuery } from '@tanstack/react-query'
import { isJsonString } from './utils'
import { useDispatch, useSelector } from 'react-redux'
import { updateUser } from './dux/slides/userSlide'
import jwt_decode from "jwt-decode";
import * as UserServices from "./services/UserServices"

function App() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user)

  useEffect(() => {
    let storageData = localStorage.getItem('access_token')
    if (storageData && isJsonString(storageData)) {
      storageData = JSON.parse(storageData)
      const decoded = jwt_decode(storageData)
      if (decoded?.id) {
        handleGetDetailsUser(decoded?.id, storageData)
      }
    }
  }, [])

  // axios.interceptors.request.use(function (config) {
  // }, function (error) {
  //   return Promise.reject(error);
  // });

  const handleGetDetailsUser = async (id, token) => {

    const res = await UserServices.getDetailsUser(id, token)

    dispatch(updateUser({ ...res?.data, access_token: token }))

  }

  // useEffect(() => {
  //   fetchAPi()
  // }, [])
  // const fetchAPi = async () => {
  //   const res = await axios.get(`${process.env.REACT_APP_API_URL}/product/get-all`)
  //   return res.data
  // }
  // const query = useQuery({ queryKey: ['todos'], queryFn: fetchAPi })
  // console.log('query', query)

  return (
    <div>
      <Router>
        <Routes>
          {routes.map((route) => {
            const Page = route.page
            const isCheckAuth = !route.isPrivate || user.isAdmin
            const Layout = route.isShowHeader ? DefaultComponent : Fragment
            return (
              <Route key={route.path} path={route.path} element={
                <Layout>
                  <Page />
                </Layout>
              } />
            )
          })}
        </Routes>
      </Router>
    </div>
  )
}

export default App
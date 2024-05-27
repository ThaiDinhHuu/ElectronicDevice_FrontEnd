import AdminPage from "../pages/AdminPage/AdminPage";
import DetailsOrderPage from "../pages/DetailsOrderPage/DetailsOrderPage";
import HommePage from "../pages/HomePage/HommePage";
import MyOrder from "../pages/MyOrder/MyOrder";
import NotFoundPage from "../pages/NotFoundPage/NotFoundPage";
import OrderPage from "../pages/OrderPage/OrderPage";
import OrderSucess from "../pages/OrderSuccess/OrderSuccess";
import PaymentPage from "../pages/PaymentPage/PaymentPage";
import ProductDetail from "../pages/ProductDetail/ProductDetail";
import ProductPage from "../pages/ProductPage/ProductPage";
import { ProfilePage } from "../pages/Profile/ProfilePage";
import SignInPage from "../pages/SignInPage/SignInPage";
import SignUpPage from "../pages/SignUpPage/SignUpPage";
import TypeProductPage from "../pages/TypeProductPage/TypeProductPage";

export const routes = [
      {
            path: '/',
            page: HommePage,
            isShowHeader: false
      },
      {
            path: '/order',
            page: OrderPage,
            isShowHeader: false
      },
      {
            path: '/orderSuccess',
            page: OrderSucess,
            isShowHeader: false
      },
      {
            path: '/myOrder',
            page: MyOrder,
            isShowHeader: false
      },
      {
            path: '/product',
            page: ProductPage,
            isShowHeader: false

      },
      {
            path: 'product/:type',
            page: TypeProductPage,
            isShowHeader: false

      },
      {
            path: '/sign-in',
            page: SignInPage,


      },
      {
            path: '/sign-up',
            page: SignUpPage,


      },
      {
            path: '/product-detail/:id',
            page: ProductDetail,
            isShowHeader: false

      },
      {
            path: '/details-order/:id',
            page: DetailsOrderPage,
            isShowHeader: false

      },
      {
            path: '/profile',
            page: ProfilePage,
            isShowHeader: false

      },
      {
            path: '/payment',
            page: PaymentPage,
            isShowHeader: false

      },
      {
            path: '/system/admin',
            page: AdminPage,
            isShowHeader: false,
            isPrivate: true
      },

      {
            path: '*',
            page: NotFoundPage,
      }
]
import type { AppProps } from "next/app"
import { Provider } from "react-redux"
import Layout from "@/layouts/Layout"
import { store } from "@/redux/store"
import PopupAlert from "@/components/PopupAlert"
import AadharPopup from "@/components/AadharPopup"
import DeletePopup from "@/components/DeletePopup"
import Loader from "@/components/Loader"
import SetUp from "@/redux/setUpInterceptors"
import AadharOTP from "@/components/AadharOTP"
import "bootstrap/dist/css/bootstrap.min.css"
import "@/styles/globals.scss"

export default function MyApp({ Component, pageProps }: AppProps) {
  SetUp()
  return (
    <Provider store={store}>
      <Loader />
      <PopupAlert />
      <DeletePopup />
      <AadharPopup />
      <AadharOTP />
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </Provider>
  )
}

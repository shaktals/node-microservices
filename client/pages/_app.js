import 'bootstrap/dist/css/bootstrap.css'

import buildClient from '../api/buildClient'

import Header from '../components/Header'

const AppComponent = ({ Component, pageProps, currentUser }) => {
  return (
    <div>
      <Header currentUser={currentUser} />
      <Component currentUser={currentUser} {...pageProps} />
    </div>
  )
}

AppComponent.getInitialProps = async ({ Component, ctx }) => {
  const client = buildClient(ctx)
  const url = '/api/users/currentuser'
  const { data } = await client.get(url)

  let pageProps = {}
  if (Component.getInitialProps) {
    pageProps = await Component.getInitialProps(ctx)
  }

  return { pageProps, ...data }
}

export default AppComponent

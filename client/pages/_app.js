import 'bootstrap/dist/css/bootstrap.css'

import buildClient from '../api/buildClient'

import Header from '../components/Header'

const AppComponent = ({ Component, pageProps, currentUser }) => {
  return (
    <div>
      <Header currentUser={currentUser} />
      <div className="container">
        <Component currentUser={currentUser} {...pageProps} />
      </div>
    </div>
  )
}

AppComponent.getInitialProps = async ({ Component, ctx }) => {
  const client = buildClient(ctx)
  const url = '/api/users/currentuser'
  const { data } = await client.get(url)

  let pageProps = {}
  if (Component.getInitialProps) {
    pageProps = await Component.getInitialProps(ctx, client, data.currentUser)
  }

  return { pageProps, ...data }
}

export default AppComponent

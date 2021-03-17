import buildClient from '../api/buildClient'

const Index = ({ currentUser }) => {
  return currentUser
    ? <h1>You are signed in</h1>
    : <h1>You are NOT signed in</h1>
}

Index.getInitialProps = async (context) => {
  const client = buildClient(context)
  const url = '/api/users/currentuser'
  const { data } = await client.get(url)

  return data
}

export default Index

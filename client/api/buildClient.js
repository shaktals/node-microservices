import axios from 'axios'

const buildClient = ({ req }) => {
  if (typeof window === 'undefined') {
    const serviceName = 'ingress-nginx-controller'
    const namespaceUri = 'kube-system.svc.cluster.local'
    const url = `http://${serviceName}.${namespaceUri}`

    return axios.create({
      baseURL: url,
      headers: req.headers,
    })
  } else {
    return axios.create()
  }
}

export default buildClient

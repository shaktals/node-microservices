## A sample Typescript Node microservices backend project

#### Installation requirements

- Stable version of Node.js
- Kubernetes cli _kubectl_
- A local instance of kubernetes running, like [minikube](https://minikube.sigs.k8s.io/docs/start/)
- [Nginx-ingress](https://kubernetes.github.io/ingress-nginx/deploy/) controller
- Docker engine
- [Skaffold](https://skaffold.dev/)
- Update your OS _hosts_ file to point [ticketing.dev](http://ticketing.dev) to your local Kubernetes cluster IP address

#### Running

- At the project root folder run _skaffold dev_

##### Credits
Based on the excellent [course on Node.js microservices](https://www.udemy.com/course/microservices-with-node-js-and-react) by Stephen Grider.

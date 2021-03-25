## A sample Typescript Node microservices backend project

#### Installation requirements

- Stable version of Node.js
- Kubernetes cli _kubectl_
- A local instance of kubernetes running, like [minikube](https://minikube.sigs.k8s.io/docs/start/)
- [Nginx-ingress](https://kubernetes.github.io/ingress-nginx/deploy/) controller
- Docker engine
- [Skaffold](https://skaffold.dev/)
- Update your OS _hosts_ file to point [ticketing.dev](https://ticketing.dev) to your local Kubernetes cluster IP address
- Create local environment variables
  - JWT_KEY, it can be any string
  - STRIPE_KEY, it need to be a valid stripe developer secret key (test key will do)
- You might need to build each service's Docker image once manually before _skaffold_ can do it for you
  - Go to each service project root and run: `docker build -t {your_docker_id}/{service_name} .`
  - Then push it to docker hub running: `docker push {your_docker_id}/{service_name}`

#### Running

- At the project root folder run _skaffold dev_

##### Credits
Based on the outstanding [course on Node.js microservices](https://www.udemy.com/course/microservices-with-node-js-and-react) by Stephen Grider.

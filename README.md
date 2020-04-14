[![Known Vulnerabilities](https://snyk.io//test/github/DEFRA/ffc-elm-apply/badge.svg?targetFile=package.json)](https://snyk.io//test/github/DEFRA/ffc-elm-apply?targetFile=package.json)

# FFC ELM

Digital service for creating Environmental Land Management applications.

## Prerequisites

AWS credentials with access to the container registry where FFC parent images are stored.

Either:
- Docker
- Docker Compose

Or:
- Kubernetes
- Helm

Or:
- Node 12

## Environment variables

### In development

The following environment variables are required in development environments running via `docker-compose`. They can be added to a `.env` file in the project root, which is listed in `.gitignore` and automatically used by Docker Compose.

| Name            | Description                                  |
|-----------------|----------------------------------------------|
| DOCKER_REGISTRY | Docker registry URL to pull base images from |

Example `.env` file:

```
DOCKER_REGISTRY=registry.example.com
```

### In production

The following environment variables are required by the application container. Default values for production-like deployments are set in the Helm chart and may be overridden by build and release pipelines.

| Name                                  | Description                | Required | Default               | Valid                       |
|---------------------------------------|----------------------------|:--------:|-----------------------|-----------------------------|
| NODE_ENV                              | Node environment           | no       | development           | development,test,production |
| PORT                                  | Port number                | no       | 3000                  |                             |
| STATIC_CACHE_TIMEOUT_IN_MILLIS        | static file cache timeout  | no       | 54000 (15 minutes)    |                             |

## How to run tests

A convenience script is provided to run automated tests in a containerised environment. This will rebuild images before running tests via docker-compose, using a combination of `docker-compose.yaml` and `docker-compose.test.yaml`. The command given to `docker-compose run` may be customised by passing arguments to the test script.

Examples:

```
# Run all tests
scripts/test

# Run only unit tests
scripts/test npm run test:unit
```

Alternatively, the same tests may be run locally via npm:

```
# Run tests without Docker
npm run test
```

### Test watcher

A more convenient way to run tests in development is to use a file watcher to automatically run tests each time associated files are modified. For this purpose, the default docker-compose configuration mounts all app, test and git files into the main `app` container, enabling the test watcher to be run as shown below. The same approach may be used to execute arbitrary commands in the running app.

```
# Run unit test file watcher
docker-compose exec app npm run test:unit-watch

# Run all tests
docker-compose exec app npm test

# Open an interactive shell in the app container
docker-compose exec app sh
```

### Why docker-compose.test.yaml exists

Given that tests can be run in the main app container during development, it may not be obvious why `docker-compose.test.yaml` exists. It's main purpose is for CI pipelines, where tests need to run in a container without any ports forwarded from the host machine.

## Running the application

The application is designed to run in containerised environments, using Docker Compose in development and Kubernetes in production.

- A Helm chart is provided in `./helm` for production deployments to Kubernetes.

### Build container image

Container images are built using Docker Compose. They extend FFC parent images so building will fail without access to the private FFC Docker registry.

```
# Authenticate with FFC Docker registry (requires pre-configured AWS credentials on your machine)
aws ecr get-login-password | docker login --password-stdin --username AWS 171014905211.dkr.ecr.eu-west-2.amazonaws.com

# Build container images
docker-compose build
```

The test script will will automatically build (or rebuild) any additional images required to run tests.

### Running in development

Use Docker Compose to run service locally in development.

Example commands:

```
# Start the service
docker-compose up

# Stop the service
docker-compose down

# Stop the service and remove data volumes
docker-compose down -v
```

Additional Docker Compose files are provided for scenarios such as linking to other ELM services running in the same environment.

```
# Start the service with links to other ELM services
docker-compose -f docker-compose.yaml -f docker-compose.link.yaml up
```

### Helm chart

For deployments to Kubernetes, a helm chart is included in the `./helm` folder. The chart is configurable through input values, with defaults defined in `./helm/values.yaml`.

#### Accessing the pod

The service is exposed via a Kubernetes ingress, which requires an ingress controller to be running on the cluster. For example, the NGINX Ingress Controller may be installed via Helm:

```
# Install nginx-ingress into its own namespace
helm install --namespace nginx-ingress nginx-ingress
```

Alternatively, a local port may be forwarded to the pod:

```
# Forward local port to the Kubernetes deployment
kubectl port-forward --namespace=ffc-elm-apply deployment/ffc-elm-apply 3000:3000
```

#### Probes

The service has HTTP readiness and liveness probes at the following end points.

Readiness: `/healthy`
Liveness: `/healthz`

#### Basic Authentication

When deployed with an NGINX Ingress Controller, the ingress may be protected with basic authentication by setting the `auth` value to a base64-encoded `htpasswd` output.

For example:

```
# Create credentials
credentials=$(htpasswd -n "${username}" | base64)

# Install or upgrade Helm chart with basic auth
helm upgrade --atomic --install --set auth=${credentials} ffc-elm-apply ./helm
```

__How basic auth is configured__

Basic authentication is enabled via labels on the ingress object. Those labels are read by the NGINX Ingress Controller and used to configure basic authentication for incoming traffic. One of the labels provides the name of a Kubernetes secret in which credentials are stored as the encoded output of a `htpasswd` command. The ingress controller uses the value of that secret to verify any basic auth attempt.

If it wasn't defined by the Helm chart, the secret could be created via the following command:

```
# Create basic auth secret for username 'defra'
kubectl create secret generic ffc-elm-apply-basic-auth2 --from-literal "auth=$(htpasswd -n defra)"
```

#### Amazon Load Balancer

Settings are available in the Helm charts to use the Amazon Load Balancer Ingress Controller rather than an NGINX Ingress Controller.
Additional child settings below `ingress` are available allowing the user to set [resource tags](https://kubernetes-sigs.github.io/aws-alb-ingress-controller/guide/ingress/annotation/#tags) and the arn of an [SSL certificate](https://kubernetes-sigs.github.io/aws-alb-ingress-controller/guide/ingress/annotation/#certificate-arn), i.e.

```
# helm/values.yaml
ingress:
  alb:
    tags: Name=myservername,Environment=myEnv,Project=MyProject,ServiceType=LOB
    arn: arn:aws:acm:eu-west-2:123456:certificate/abcdef0000-123a-4321-abc8-a1234567z
```

### Running without containers

The application may be run natively on the local operating system if NPM is installed.

```
# Build the application
npm run build

# Run the application
node app
```

## Build Pipeline

A [`Jenkinsfile`](./Jenkinsfile) is included, which defines the build and test pipeline for this application.

## Licence

THIS INFORMATION IS LICENSED UNDER THE CONDITIONS OF THE OPEN GOVERNMENT LICENCE found at:

<http://www.nationalarchives.gov.uk/doc/open-government-licence/version/3>

The following attribution statement MUST be cited in your products and applications when using this information.

> Contains public sector information licensed under the Open Government license v3

### About the license

The Open Government Licence (OGL) was developed by the Controller of Her Majesty's Stationery Office (HMSO) to enable information providers in the public sector to license the use and re-use of their information under a common open licence.

It is designed to encourage use and re-use of information freely and flexibly, with only a few conditions.

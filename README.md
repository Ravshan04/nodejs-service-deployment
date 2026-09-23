# Node.js Service Deployment

Project URL: https://roadmap.sh/projects/nodejs-service-deployment

[![Test and deploy](https://github.com/Ravshan04/nodejs-service-deployment/actions/workflows/deploy.yml/badge.svg)](https://github.com/Ravshan04/nodejs-service-deployment/actions/workflows/deploy.yml)

Live service: http://54.194.155.56

A dependency-free Node.js HTTP service deployed with Ansible and automatically
released by GitHub Actions. Nginx exposes the service on port 80 while systemd
keeps the Node.js process running on localhost port 3000.

## Endpoints

- `GET /` returns `Hello, world!`
- `GET /health` returns `{ "status": "ok" }`

## Run locally

```sh
npm ci
npm test
npm run build
npm start
curl http://127.0.0.1:3000/
```

## Manual Ansible deployment

Update `ansible/inventory.ini`, then run:

```sh
cd ansible
ansible-playbook node_service.yml \
  --tags app \
  --private-key ~/.ssh/roadmap-ec2-key.pem
```

The `app` role installs Node.js, npm, Git, and Nginx; clones this repository;
installs dependencies; builds the service; installs a hardened systemd unit;
and configures an Nginx reverse proxy.

## Automated deployment

Every push to `main` runs tests and the build before deployment. Configure
these GitHub Actions repository secrets:

| Secret | Value |
| --- | --- |
| `SERVER_HOST` | Public IP or hostname of the server |
| `SSH_USER` | SSH user, such as `ubuntu` or `root` |
| `SSH_PRIVATE_KEY` | Private key matching a public key installed on the server |

The workflow passes deployment values at runtime; no private key or secret is
stored in the repository.

## Architecture

```text
Git push -> GitHub Actions -> tests/build -> Ansible over SSH
                                              |
Browser -> port 80 -> Nginx -> 127.0.0.1:3000 -> Node.js systemd service
```

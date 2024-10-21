# Video Project - Microservice Architecture


## 프로젝트 아키텍쳐

- 모놀리식 => 마이크로서비스 전환
- docker-compose를 활용하여 로컬 개발 환경에서 마이크로서비스 세팅
- TCP를 활용한 동기 통신
- Kafka를 활용한 비동기 통신
 <p align="center"><img src="https://github.com/user-attachments/assets/fdf40d57-c106-4e51-8cdf-8f42e4ad8152"></p>

## 서비스 주요 사항

- NestJS 마이크로서비스 적용
- docker compose를 활용하여 로컬 개발 환경에서 마이크로서비스 구동
- docker compose를 활용하여 Postgres, Kafka 구동
- 마이크로서비스간의 http 동기 통신
- 마이크로서비스간의 Kafka 비동기 통신
  <p align="center"><img src="https://github.com/user-attachments/assets/0288a4f8-abdf-4cae-91e1-70f4df0af2e6"></p>

## Docker

- 각 마이크로서비스별로 도커 파일 작성
- 완전히 분리된 환경에서 각각의 마이크로서비스를 띄울 수 있음

```bash
$ npm i
$ cd apps / cd analytics -> npm i
$ cd apps / cd api-gateway -> npm i
$ cd apps / cd user -> npm i
$ cd apps / cd video -> npm i
```

```bash
$ docker build -t api-gateway .
$ docker run -p 3000:3000 --name api-gateway api-gateway
```

## 기술 스택

- Typescript 4.7.4
- Node.js 18.14.0
- NestJS 9.0.0
- Postgres 14.6
- Kafka 2.8.1
- Docker, Docker Compose
- Git

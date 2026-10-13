# Restaurant

GraphQL API (Spring Boot, `server/`) + website and admin panel (Next.js, `client/`).

## Start

```bash
# 1. server  ->  http://localhost:8080/graphql   (test page: http://localhost:8080/graphiql)
cd server
./mvnw spring-boot:run

# 2. client  ->  http://localhost:3000
cd client
pnpm install    # first time only
pnpm dev
```

The whole API is described in `server/src/main/resources/graphql/schema.graphqls`.
The client sends its queries and mutations from `client/src/api/`.

# Getting Started

### Reference Documentation
For further reference, please consider the following sections:

* [Official Apache Maven documentation](https://maven.apache.org/guides/index.html)
* [Spring Boot Maven Plugin Reference Guide](https://docs.spring.io/spring-boot/docs/3.2.4-SNAPSHOT/maven-plugin/reference/html/)
* [Create an OCI image](https://docs.spring.io/spring-boot/docs/3.2.4-SNAPSHOT/maven-plugin/reference/html/#build-image)
* [Spring Boot Testcontainers support](https://docs.spring.io/spring-boot/docs/3.2.4-SNAPSHOT/reference/html/features.html#features.testing.testcontainers)
* [Testcontainers Postgres Module Reference Guide](https://java.testcontainers.org/modules/databases/postgres/)
* [Spring Web](https://docs.spring.io/spring-boot/docs/3.2.4-SNAPSHOT/reference/htmlsingle/index.html#web)
* [Spring Data JPA](https://docs.spring.io/spring-boot/docs/3.2.4-SNAPSHOT/reference/htmlsingle/index.html#data.sql.jpa-and-spring-data)
* [Spring Security](https://docs.spring.io/spring-boot/docs/3.2.4-SNAPSHOT/reference/htmlsingle/index.html#web.security)
* [Validation](https://docs.spring.io/spring-boot/docs/3.2.4-SNAPSHOT/reference/htmlsingle/index.html#io.validation)
* [Testcontainers](https://java.testcontainers.org/)
* [Spring REST Docs](https://docs.spring.io/spring-restdocs/docs/current/reference/htmlsingle/)
* [Java Mail Sender](https://docs.spring.io/spring-boot/docs/3.2.4-SNAPSHOT/reference/htmlsingle/index.html#io.email)
* [Spring Cache Abstraction](https://docs.spring.io/spring-boot/docs/3.2.4-SNAPSHOT/reference/htmlsingle/index.html#io.caching)
* [Spring Batch](https://docs.spring.io/spring-boot/docs/3.2.4-SNAPSHOT/reference/htmlsingle/index.html#howto.batch)
* [WebSocket](https://docs.spring.io/spring-boot/docs/3.2.4-SNAPSHOT/reference/htmlsingle/index.html#messaging.websockets)
* [OAuth2 Client](https://docs.spring.io/spring-boot/docs/3.2.4-SNAPSHOT/reference/htmlsingle/index.html#web.security.oauth2.client)
* [Spring Session](https://docs.spring.io/spring-session/reference/)
* [Spring Boot DevTools](https://docs.spring.io/spring-boot/docs/3.2.4-SNAPSHOT/reference/htmlsingle/index.html#using.devtools)

### Guides
The following guides illustrate how to use some features concretely:

* [Building a RESTful Web Service](https://spring.io/guides/gs/rest-service/)
* [Serving Web Content with Spring MVC](https://spring.io/guides/gs/serving-web-content/)
* [Building REST services with Spring](https://spring.io/guides/tutorials/rest/)
* [Accessing Data with JPA](https://spring.io/guides/gs/accessing-data-jpa/)
* [Securing a Web Application](https://spring.io/guides/gs/securing-web/)
* [Spring Boot and OAuth2](https://spring.io/guides/tutorials/spring-boot-oauth2/)
* [Authenticating a User with LDAP](https://spring.io/guides/gs/authenticating-ldap/)
* [Validation](https://spring.io/guides/gs/validating-form-input/)
* [Caching Data with Spring](https://spring.io/guides/gs/caching/)
* [Creating a Batch Service](https://spring.io/guides/gs/batch-processing/)
* [Using WebSocket to build an interactive web application](https://spring.io/guides/gs/messaging-stomp-websocket/)

### Testcontainers support

This project uses [Testcontainers at development time](https://docs.spring.io/spring-boot/docs/3.2.4-SNAPSHOT/reference/html/features.html#features.testing.testcontainers.at-development-time).

Testcontainers has been configured to use the following Docker images:

* [`postgres:latest`](https://hub.docker.com/_/postgres)

Please review the tags of the used images and set them to the same as you're running in production.


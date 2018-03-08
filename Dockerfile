FROM openjdk:8
ADD target/demo-0.1.0-SNAPSHOT.jar demo-0.1.0-SNAPSHOT.jar
EXPOSE 8085
ENTRYPOINT ["java", "-jar", "demo-0.1.0-SNAPSHOT.jar"]
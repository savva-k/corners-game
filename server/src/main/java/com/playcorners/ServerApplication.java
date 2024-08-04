package com.playcorners;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class ServerApplication {

  public static void main(String[] args) {
    System.out.println("Test");
    SpringApplication.run(ServerApplication.class, args);
  }

}

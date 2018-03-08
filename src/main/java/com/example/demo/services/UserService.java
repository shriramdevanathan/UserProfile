package com.example.demo.services;

import com.example.demo.model.User;
import com.example.demo.model.UserRequest;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import java.util.List;


public interface UserService {

    User findById(Long id);
    User findByUsername(String username);
    List<User> findAll ();
    User save(UserRequest user);
    void deleteCustomer(Long id);
    User update(Long id, UserRequest user);
}

package com.example.demo.services.impl;

import com.example.demo.model.Authority;
import com.example.demo.model.User;
import com.example.demo.model.UserRequest;
import com.example.demo.repository.UserRepository;
import com.example.demo.services.AuthorityService;
import com.example.demo.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private AuthorityService authService;
    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private UserRepository userRepository;

    @Override
    public User findByUsername( String username ) throws UsernameNotFoundException {
        User u = userRepository.findByUsername( username );
        return u;
    }
    @Override
    public User findById(Long id ) throws AccessDeniedException {
       User u = userRepository.findOne(id);
       return u;
    }
    @Override
    public List<User> findAll() throws AccessDeniedException {
        List<User> result = userRepository.findAll();
        return result;
    }

    @Override
    public User save(UserRequest userRequest) {
        User user = new User();
        user.setUsername(userRequest.getUsername());
        user.setPassword(passwordEncoder.encode(userRequest.getPassword()));
        user.setFirstName(userRequest.getFirstname());
        user.setLastName(userRequest.getLastname());
        user.setEnabled(true);
        List<Authority> auth = authService.findByname("ROLE_USER");
        user.setAuthorities(auth);
        this.userRepository.save(user);
        return user;
    }

    @Override
    public void deleteCustomer(Long id) {
        User user = userRepository.findOne(id);
        user.getAuthorities().removeAll(user.getAuthorities());
        userRepository.delete(user);
    }

    @Override
    public User update(Long id, UserRequest userRequest) {
        User user = userRepository.findOne(id);
        user.setUsername(userRequest.getUsername());
        user.setFirstName(userRequest.getFirstname());
        user.setLastName(userRequest.getLastname());
        userRepository.save(user);
        return user;
    }
}

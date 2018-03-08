package com.example.demo.controller;

import com.example.demo.exception.ResourceConflictException;
import com.example.demo.model.User;
import com.example.demo.model.UserRequest;
import com.example.demo.services.UserService;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;

import java.security.Principal;
import java.util.List;

import static org.springframework.web.bind.annotation.RequestMethod.GET;
import static org.springframework.web.bind.annotation.RequestMethod.POST;

@RestController
@RequestMapping( value = "/api", produces = MediaType.APPLICATION_JSON_VALUE )
public class UserController {

    @Autowired
    private UserService userService;

    @RequestMapping( method = GET, value = "/user/{userId}" )
    @ApiOperation(value="Load User by Id")
    @PreAuthorize("hasRole('ADMIN')")
    public User loadById( @PathVariable Long userId ) {
        return this.userService.findById( userId );
    }

    @RequestMapping( method = GET, value= "/user/all")
    @ApiOperation(value="Get all users")
    @PreAuthorize("hasRole('ADMIN')")
    public List<User> loadAll() {
        return this.userService.findAll();
    }

    @RequestMapping(value = "/users", method = RequestMethod.PUT)
    @ApiOperation(value="Update User")
    public User updateCustomer(@RequestBody UserRequest customer) {
        return userService.update(customer.getId(), customer);
    }




    @RequestMapping(method = POST, value = "/signup")
    @ApiOperation(value="Add new user, just fyi id field doesnt matter")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> addUser(@RequestBody UserRequest userRequest,
                                     UriComponentsBuilder ucBuilder) {

        User existUser = this.userService.findByUsername(userRequest.getUsername());
        if (existUser != null) {
            throw new ResourceConflictException(userRequest.getId(), "Username already exists");
        }
        User user = this.userService.save(userRequest);
        HttpHeaders headers = new HttpHeaders();
        headers.setLocation(ucBuilder.path("/api/user/{userId}").buildAndExpand(user.getId()).toUri());
        return new ResponseEntity<User>(user, HttpStatus.CREATED);
    }

    @RequestMapping(value = "/{id}", method = RequestMethod.DELETE)
    @ApiOperation(value="Delete user")
    @PreAuthorize("hasRole('USER')")
    public void deleteUser(@PathVariable Long id) {
        userService.deleteCustomer(id);
    }


    @RequestMapping(value = "/user/username/{username}", method = RequestMethod.GET)
    @PreAuthorize("hasRole('ADMIN')")
    @ApiOperation(value="Load User by Username")

    public void loadUserByUsername(@PathVariable String username) {
        userService.findByUsername (username);
    }


    /**
     * Getting using princial will load from authentication aobject
     * @return
     */
    @ApiOperation(value="Get Current User Details")
    @RequestMapping(value = "/whoami",  method = RequestMethod.GET )
    @PreAuthorize("hasRole('USER')")
    public User user() {
        return (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }
}


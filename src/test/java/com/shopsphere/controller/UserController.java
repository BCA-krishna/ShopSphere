package com.shopsphere.controller;

import com.shopsphere.dto.UserRequest;
import com.shopsphere.dto.UserResponse;
import com.shopsphere.service.UserService;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping
    public UserResponse registerUser(@Valid @RequestBody UserRequest request) {

        System.out.println(">>> POST endpoint reached <<<");

        return userService.registerUser(request);
    }
    @GetMapping("/test")
    public String test() {
        return "Controller is working";
    }

    @GetMapping
    public List<UserResponse> getAllUsers() {
        return userService.getAllUsers();
    }
}
package com.college.transcript.controller;

import java.util.Map;
import java.util.Optional;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.college.transcript.User;
import com.college.transcript.repository.UserRepository;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    private final UserRepository userRepository;

    public AuthController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // =========================
    // REGISTER
    // =========================
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {

        Optional<User> existingUser =
                userRepository.findByEmail(user.getEmail());

        if (existingUser.isPresent()) {
            return ResponseEntity.badRequest()
                    .body("Email already registered");
        }

        // Combine first name and last name
        user.setName(user.getFirstName() + " " + user.getLastName());

        // Default role
        if (user.getRole() == null || user.getRole().isEmpty()) {
            user.setRole("STUDENT");
        }

        User savedUser = userRepository.save(user);

        return ResponseEntity.ok(savedUser);
    }

    // =========================
    // LOGIN
    // =========================
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User loginUser) {

        Optional<User> userOptional =
                userRepository.findByEmail(loginUser.getEmail());

        if (userOptional.isEmpty()) {
            return ResponseEntity.status(401)
                    .body(Map.of("message", "Invalid email or password"));
        }

        User user = userOptional.get();

        if (!user.getPassword().equals(loginUser.getPassword())) {
            return ResponseEntity.status(401)
                    .body(Map.of("message", "Invalid email or password"));
        }

        // Temporary token for our project
        String token =
                "dtcis-" + user.getId() + "-" + user.getEmail();

        return ResponseEntity.ok(
                Map.of(
                        "token", token,
                        "user", user,
                        "expiresIn", 3600
                )
        );
    }

    // =========================
    // CURRENT USER
    // =========================
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(
            @RequestHeader(
                    value = "Authorization",
                    required = false
            ) String authorization) {

        if (authorization == null ||
                !authorization.startsWith("Bearer ")) {

            return ResponseEntity.status(401)
                    .body(Map.of("message", "Not authenticated"));
        }

        String token = authorization.substring(7);

        // Token format:
        // dtcis-userId-email
        if (!token.startsWith("dtcis-")) {
            return ResponseEntity.status(401)
                    .body(Map.of("message", "Invalid token"));
        }

        String[] parts = token.split("-", 3);

        if (parts.length < 3) {
            return ResponseEntity.status(401)
                    .body(Map.of("message", "Invalid token"));
        }

        String email = parts[2];

        Optional<User> userOptional =
                userRepository.findByEmail(email);

        if (userOptional.isEmpty()) {
            return ResponseEntity.status(401)
                    .body(Map.of("message", "User not found"));
        }

        return ResponseEntity.ok(userOptional.get());
    }
}
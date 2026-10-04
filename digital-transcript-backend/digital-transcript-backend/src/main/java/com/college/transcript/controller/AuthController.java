package com.college.transcript.controller;

import java.util.Map;
import java.util.Optional;

import org.springframework.dao.DataIntegrityViolationException;
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

    // =========================================================
    // STUDENT REGISTRATION
    // =========================================================
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {

        try {

            // -------------------------------------------------
            // Check duplicate email
            // -------------------------------------------------
            Optional<User> existingEmail =
                    userRepository.findByEmail(user.getEmail());

            if (existingEmail.isPresent()) {
                return ResponseEntity.badRequest().body(
                        Map.of(
                                "message",
                                "Email is already registered. Please use another email."
                        )
                );
            }

            // -------------------------------------------------
            // Check duplicate Student ID
            // -------------------------------------------------
            Optional<User> existingStudentId =
                    userRepository.findAll()
                            .stream()
                            .filter(existing ->
                                    existing.getStudentId() != null
                                    && existing.getStudentId()
                                            .equalsIgnoreCase(user.getStudentId())
                            )
                            .findFirst();

            if (existingStudentId.isPresent()) {
                return ResponseEntity.badRequest().body(
                        Map.of(
                                "message",
                                "Student ID " + user.getStudentId()
                                        + " is already registered. Please use a different Student ID."
                        )
                );
            }

            // -------------------------------------------------
            // Student accounts are always STUDENT
            // -------------------------------------------------
            user.setRole("STUDENT");

            // -------------------------------------------------
            // Generate full name
            // -------------------------------------------------
            user.setName(
                    user.getFirstName() + " " + user.getLastName()
            );

            // -------------------------------------------------
            // Save student
            // -------------------------------------------------
            User savedUser = userRepository.save(user);

            // -------------------------------------------------
            // Generate authentication token
            // -------------------------------------------------
            String token =
                    "dtcis-" + savedUser.getId()
                    + "-" + savedUser.getEmail();

            // -------------------------------------------------
            // Return same format expected by frontend
            // -------------------------------------------------
            return ResponseEntity.ok(
                    Map.of(
                            "token", token,
                            "user", savedUser,
                            "expiresIn", 3600
                    )
            );

        } catch (DataIntegrityViolationException e) {

            // -------------------------------------------------
            // Handle database uniqueness errors gracefully
            // -------------------------------------------------
            return ResponseEntity.badRequest().body(
                    Map.of(
                            "message",
                            "Registration failed. Email or Student ID may already be registered."
                    )
            );
        }
    }

    // =========================================================
    // ADMIN REGISTRATION
    // =========================================================
    @PostMapping("/admin/register")
    public ResponseEntity<?> registerAdmin(@RequestBody User user) {

        try {

            // -------------------------------------------------
            // Check duplicate email
            // -------------------------------------------------
            Optional<User> existingEmail =
                    userRepository.findByEmail(user.getEmail());

            if (existingEmail.isPresent()) {
                return ResponseEntity.badRequest().body(
                        Map.of(
                                "message",
                                "Email is already registered. Please use another email."
                        )
                );
            }

            // -------------------------------------------------
            // Administrator accounts are always ADMIN
            // -------------------------------------------------
            user.setRole("ADMIN");

            // -------------------------------------------------
            // Generate full name
            // -------------------------------------------------
            user.setName(
                    user.getFirstName() + " " + user.getLastName()
            );

            // -------------------------------------------------
            // User entity currently requires these fields.
            // Give admin accounts safe default values.
            // -------------------------------------------------
            if (user.getStudentId() == null
                    || user.getStudentId().isBlank()) {

                user.setStudentId(
                        "ADMIN-" + System.currentTimeMillis()
                );
            }

            if (user.getCourse() == null
                    || user.getCourse().isBlank()) {

                user.setCourse("Administration");
            }

            if (user.getDepartment() == null
                    || user.getDepartment().isBlank()) {

                user.setDepartment("Administration");
            }

            if (user.getYearOfStudy() == null
                    || user.getYearOfStudy().isBlank()) {

                user.setYearOfStudy("N/A");
            }

            // -------------------------------------------------
            // Save admin
            // -------------------------------------------------
            User savedUser = userRepository.save(user);

            // -------------------------------------------------
            // Generate authentication token
            // -------------------------------------------------
            String token =
                    "dtcis-" + savedUser.getId()
                    + "-" + savedUser.getEmail();

            // -------------------------------------------------
            // Return authentication response
            // -------------------------------------------------
            return ResponseEntity.ok(
                    Map.of(
                            "token", token,
                            "user", savedUser,
                            "expiresIn", 3600
                    )
            );

        } catch (DataIntegrityViolationException e) {

            return ResponseEntity.badRequest().body(
                    Map.of(
                            "message",
                            "Admin registration failed. Email or Student ID may already be registered."
                    )
            );
        }
    }

    // =========================================================
    // LOGIN
    // =========================================================
    @PostMapping("/login")
    public ResponseEntity<?> login(
            @RequestBody User loginUser) {

        Optional<User> userOptional =
                userRepository.findByEmail(loginUser.getEmail());

        if (userOptional.isEmpty()) {

            return ResponseEntity.status(401).body(
                    Map.of(
                            "message",
                            "Invalid email or password"
                    )
            );
        }

        User user = userOptional.get();

        // -----------------------------------------------------
        // Check password
        // -----------------------------------------------------
        if (!user.getPassword().equals(loginUser.getPassword())) {

            return ResponseEntity.status(401).body(
                    Map.of(
                            "message",
                            "Invalid email or password"
                    )
            );
        }

        // -----------------------------------------------------
        // Generate token
        // -----------------------------------------------------
        String token =
                "dtcis-" + user.getId()
                + "-" + user.getEmail();

        return ResponseEntity.ok(
                Map.of(
                        "token", token,
                        "user", user,
                        "expiresIn", 3600
                )
        );
    }

    // =========================================================
    // LOGOUT
    // =========================================================
    @PostMapping("/logout")
    public ResponseEntity<?> logout() {

        // Logout does NOT delete anything from MySQL.
        // It only tells frontend that logout was successful.

        return ResponseEntity.ok(
                Map.of(
                        "message",
                        "Logout successful"
                )
        );
    }

    // =========================================================
    // GET CURRENT USER
    // =========================================================
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(
            @RequestHeader(
                    value = "Authorization",
                    required = false
            ) String authorization) {

        // -----------------------------------------------------
        // Check Authorization header
        // -----------------------------------------------------
        if (authorization == null
                || !authorization.startsWith("Bearer ")) {

            return ResponseEntity.status(401).body(
                    Map.of(
                            "message",
                            "Not authenticated"
                    )
            );
        }

        // -----------------------------------------------------
        // Extract token
        // -----------------------------------------------------
        String token =
                authorization.substring(7);

        // -----------------------------------------------------
        // Validate token prefix
        // -----------------------------------------------------
        if (!token.startsWith("dtcis-")) {

            return ResponseEntity.status(401).body(
                    Map.of(
                            "message",
                            "Invalid token"
                    )
            );
        }

        // -----------------------------------------------------
        // Extract email
        //
        // Token format:
        // dtcis-ID-email
        // -----------------------------------------------------
        String[] parts =
                token.split("-", 3);

        if (parts.length < 3) {

            return ResponseEntity.status(401).body(
                    Map.of(
                            "message",
                            "Invalid token"
                    )
            );
        }

        String email = parts[2];

        // -----------------------------------------------------
        // Find user
        // -----------------------------------------------------
        Optional<User> userOptional =
                userRepository.findByEmail(email);

        if (userOptional.isEmpty()) {

            return ResponseEntity.status(401).body(
                    Map.of(
                            "message",
                            "User not found"
                    )
            );
        }

        return ResponseEntity.ok(
                userOptional.get()
        );
    }
}
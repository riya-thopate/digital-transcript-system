package com.college.transcript.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.college.transcript.User;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);
}
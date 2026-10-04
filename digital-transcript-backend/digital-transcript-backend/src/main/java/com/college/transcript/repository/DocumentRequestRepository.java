package com.college.transcript.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.college.transcript.User;
import com.college.transcript.entity.DocumentRequest;

public interface DocumentRequestRepository
        extends JpaRepository<DocumentRequest, Long> {

    List<DocumentRequest> findByUserOrderByUpdatedAtDesc(User user);
}
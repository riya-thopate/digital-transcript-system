package com.college.transcript.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.college.transcript.User;
import com.college.transcript.entity.Notification;

public interface NotificationRepository
        extends JpaRepository<Notification, Long> {

    List<Notification> findByUserOrderByCreatedAtDesc(User user);
}
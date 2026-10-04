package com.college.transcript.controller;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.college.transcript.User;
import com.college.transcript.entity.Notification;
import com.college.transcript.repository.NotificationRepository;
import com.college.transcript.repository.UserRepository;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = "http://localhost:5173")
public class NotificationController {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    public NotificationController(
            NotificationRepository notificationRepository,
            UserRepository userRepository) {

        this.notificationRepository = notificationRepository;
        this.userRepository = userRepository;
    }

    // ==========================================
    // GET MY NOTIFICATIONS
    // ==========================================

    @GetMapping
    public ResponseEntity<?> getNotifications(
            @RequestHeader(value = "Authorization", required = false)
            String authorization) {

        User user = getUserFromToken(authorization);

        if (user == null) {
            return ResponseEntity.status(401).body(
                    Map.of("message", "Unauthorized")
            );
        }

        List<Notification> notifications =
                notificationRepository.findByUserOrderByCreatedAtDesc(user);

        List<Map<String, Object>> response = new ArrayList<>();

        for (Notification notification : notifications) {

            Map<String, Object> item = new LinkedHashMap<>();

            item.put("id", String.valueOf(notification.getId()));
            item.put("title", notification.getTitle());
            item.put("message", notification.getMessage());
            item.put("read", notification.isRead());
            item.put("createdAt", notification.getCreatedAt());

            response.add(item);
        }

        return ResponseEntity.ok(response);
    }

    // ==========================================
    // MARK ONE NOTIFICATION AS READ
    // ==========================================

    @PutMapping("/{id}/read")
    public ResponseEntity<?> markAsRead(
            @RequestHeader(value = "Authorization", required = false)
            String authorization,
            @PathVariable Long id) {

        User user = getUserFromToken(authorization);

        if (user == null) {
            return ResponseEntity.status(401).body(
                    Map.of("message", "Unauthorized")
            );
        }

        Notification notification =
                notificationRepository.findById(id).orElse(null);

        if (notification == null) {
            return ResponseEntity.status(404).body(
                    Map.of("message", "Notification not found")
            );
        }

        if (!notification.getUser().getId().equals(user.getId())) {
            return ResponseEntity.status(403).body(
                    Map.of("message", "You cannot access this notification")
            );
        }

        notification.setRead(true);

        notificationRepository.save(notification);

        return ResponseEntity.ok(
                Map.of("message", "Notification marked as read")
        );
    }

    // ==========================================
    // MARK ALL NOTIFICATIONS AS READ
    // ==========================================

    @PutMapping("/read-all")
    public ResponseEntity<?> markAllAsRead(
            @RequestHeader(value = "Authorization", required = false)
            String authorization) {

        User user = getUserFromToken(authorization);

        if (user == null) {
            return ResponseEntity.status(401).body(
                    Map.of("message", "Unauthorized")
            );
        }

        List<Notification> notifications =
                notificationRepository.findByUserOrderByCreatedAtDesc(user);

        for (Notification notification : notifications) {
            notification.setRead(true);
        }

        notificationRepository.saveAll(notifications);

        return ResponseEntity.ok(
                Map.of("message", "All notifications marked as read")
        );
    }

    // ==========================================
    // GET USER FROM TEMPORARY TOKEN
    // ==========================================

    private User getUserFromToken(String authorization) {

        if (authorization == null ||
                !authorization.startsWith("Bearer ")) {

            return null;
        }

        String token = authorization.substring(7);

        if (!token.startsWith("dtcis-")) {
            return null;
        }

        int lastDash = token.lastIndexOf("-");

        if (lastDash == -1) {
            return null;
        }

        String email = token.substring(lastDash + 1);

        return userRepository
                .findByEmail(email)
                .orElse(null);
    }
}
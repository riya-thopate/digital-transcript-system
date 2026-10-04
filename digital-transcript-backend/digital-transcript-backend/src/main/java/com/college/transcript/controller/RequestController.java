package com.college.transcript.controller;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.college.transcript.User;
import com.college.transcript.entity.DocumentRequest;
import com.college.transcript.entity.Notification;
import com.college.transcript.repository.DocumentRequestRepository;
import com.college.transcript.repository.NotificationRepository;
import com.college.transcript.repository.UserRepository;

@RestController
@RequestMapping("/api/requests")
@CrossOrigin(origins = "http://localhost:5173")
public class RequestController {

    private final DocumentRequestRepository requestRepository;
    private final UserRepository userRepository;
    private final NotificationRepository notificationRepository;

    public RequestController(
            DocumentRequestRepository requestRepository,
            UserRepository userRepository,
            NotificationRepository notificationRepository) {

        this.requestRepository = requestRepository;
        this.userRepository = userRepository;
        this.notificationRepository = notificationRepository;
    }

    // =========================================================
    // GET MY REQUESTS
    // =========================================================
    @GetMapping
    public ResponseEntity<Map<String, Object>> getRequests(
            @RequestHeader(value = "Authorization", required = false)
            String authorization,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        User user = getUserFromToken(authorization);

        if (user == null) {
            return ResponseEntity.status(401).body(
                    Map.of("message", "Unauthorized")
            );
        }

        List<DocumentRequest> allRequests =
                requestRepository.findByUserOrderByUpdatedAtDesc(user);

        int fromIndex = Math.min(page * size, allRequests.size());
        int toIndex = Math.min(fromIndex + size, allRequests.size());

        List<DocumentRequest> pageContent =
                allRequests.subList(fromIndex, toIndex);

        List<Map<String, Object>> content = new ArrayList<>();

        for (DocumentRequest request : pageContent) {
            content.add(toResponse(request));
        }

        Map<String, Object> response = new HashMap<>();

        response.put("content", content);
        response.put("totalElements", allRequests.size());

        response.put(
                "totalPages",
                size == 0
                        ? 0
                        : (int) Math.ceil(
                                (double) allRequests.size() / size
                        )
        );

        response.put("size", size);
        response.put("number", page);
        response.put("page", page);

        return ResponseEntity.ok(response);
    }

    // =========================================================
    // GET REQUEST BY ID
    // =========================================================
    @GetMapping("/{id}")
    public ResponseEntity<?> getRequestById(
            @RequestHeader(value = "Authorization", required = false)
            String authorization,
            @PathVariable Long id) {

        User user = getUserFromToken(authorization);

        if (user == null) {
            return ResponseEntity.status(401).body(
                    Map.of("message", "Unauthorized")
            );
        }

        Optional<DocumentRequest> optionalRequest =
                requestRepository.findById(id);

        if (optionalRequest.isEmpty()) {
            return ResponseEntity.status(404).body(
                    Map.of("message", "Request not found")
            );
        }

        DocumentRequest request = optionalRequest.get();

        // Student can only see their own request
        if (!request.getUser().getId().equals(user.getId())) {
            return ResponseEntity.status(403).body(
                    Map.of("message", "You cannot access this request")
            );
        }

        return ResponseEntity.ok(toResponse(request));
    }

    // =========================================================
    // CREATE NEW REQUEST
    // =========================================================
    @PostMapping(consumes = "multipart/form-data")
    public ResponseEntity<?> createRequest(

            @RequestHeader(value = "Authorization", required = false)
            String authorization,

            @RequestParam("documentType")
            String documentType,

            @RequestParam("purpose")
            String purpose,

            @RequestParam("numberOfCopies")
            int numberOfCopies,

            @RequestParam(value = "additionalInfo", required = false)
            String additionalInfo,

            @RequestPart(value = "documents", required = false)
            List<MultipartFile> documents) {

        // -----------------------------------------------------
        // Get logged-in student
        // -----------------------------------------------------
        User user = getUserFromToken(authorization);

        if (user == null) {
            return ResponseEntity.status(401).body(
                    Map.of("message", "Unauthorized")
            );
        }

        LocalDateTime now = LocalDateTime.now();

        // -----------------------------------------------------
        // Create request
        // -----------------------------------------------------
        DocumentRequest request = new DocumentRequest();

        request.setUser(user);
        request.setDocumentType(documentType);
        request.setPurpose(purpose);
        request.setNumberOfCopies(numberOfCopies);
        request.setAdditionalInfo(additionalInfo);

        request.setStatus("PENDING");

        request.setSubmittedAt(now);
        request.setUpdatedAt(now);

        // -----------------------------------------------------
        // Generate request reference
        // -----------------------------------------------------
        String requestRef =
                "REQ-" +
                now.getYear() +
                "-" +
                String.format(
                        "%04d",
                        requestRepository.count() + 1
                );

        request.setRequestRef(requestRef);

        // -----------------------------------------------------
        // Store supporting document names
        // -----------------------------------------------------
        List<String> uploadedFiles = new ArrayList<>();

        if (documents != null) {

            for (MultipartFile file : documents) {

                if (file != null && !file.isEmpty()) {

                    String fileName = file.getOriginalFilename();

                    if (fileName != null && !fileName.isBlank()) {
                        uploadedFiles.add(fileName);
                    }
                }
            }
        }

        request.setSupportingDocuments(
                String.join(",", uploadedFiles)
        );

        // -----------------------------------------------------
        // Save request to database
        // -----------------------------------------------------
        DocumentRequest saved =
                requestRepository.save(request);

        // =====================================================
        // CREATE NOTIFICATION
        // =====================================================
        Notification notification = new Notification();

        notification.setUser(user);
        notification.setTitle("Request Submitted");

        notification.setMessage(
                "Your " +
                saved.getDocumentType() +
                " request " +
                saved.getRequestRef() +
                " has been submitted successfully."
        );

        notification.setRead(false);
        notification.setCreatedAt(now);

        notificationRepository.save(notification);

        // -----------------------------------------------------
        // Return saved request
        // -----------------------------------------------------
        return ResponseEntity.ok(
                toResponse(saved)
        );
    }

    // =========================================================
    // CONVERT ENTITY TO FRONTEND RESPONSE
    // =========================================================
    private Map<String, Object> toResponse(
            DocumentRequest request) {

        User user = request.getUser();

        Map<String, Object> response =
                new LinkedHashMap<>();

        response.put(
                "id",
                String.valueOf(request.getId())
        );

        response.put(
                "requestRef",
                request.getRequestRef()
        );

        response.put(
                "studentId",
                user.getStudentId()
        );

        response.put(
                "studentName",
                getFullName(user)
        );

        response.put(
                "studentEmail",
                user.getEmail()
        );

        response.put(
                "studentCourse",
                user.getCourse()
        );

        response.put(
                "studentDepartment",
                user.getDepartment()
        );

        response.put(
                "documentType",
                request.getDocumentType()
        );

        response.put(
                "purpose",
                request.getPurpose()
        );

        response.put(
                "numberOfCopies",
                request.getNumberOfCopies()
        );

        response.put(
                "additionalInfo",
                request.getAdditionalInfo()
        );

        response.put(
                "status",
                request.getStatus()
        );

        response.put(
                "submittedAt",
                request.getSubmittedAt()
        );

        response.put(
                "updatedAt",
                request.getUpdatedAt()
        );

        // -----------------------------------------------------
        // Supporting documents
        // -----------------------------------------------------
        List<Map<String, Object>> supportingDocuments =
                new ArrayList<>();

        String storedDocuments =
                request.getSupportingDocuments();

        if (storedDocuments != null &&
                !storedDocuments.isBlank()) {

            String[] fileNames =
                    storedDocuments.split(",");

            for (String fileName : fileNames) {

                if (!fileName.isBlank()) {

                    Map<String, Object> file =
                            new LinkedHashMap<>();

                    file.put("name", fileName.trim());

                    supportingDocuments.add(file);
                }
            }
        }

        response.put(
                "supportingDocuments",
                supportingDocuments
        );

        // -----------------------------------------------------
        // Status timeline
        // -----------------------------------------------------
        List<Map<String, Object>> timeline =
                new ArrayList<>();

        Map<String, Object> timelineItem =
                new LinkedHashMap<>();

        timelineItem.put(
                "id",
                "timeline-" + request.getId()
        );

        timelineItem.put(
                "status",
                request.getStatus()
        );

        timelineItem.put(
                "timestamp",
                request.getSubmittedAt()
        );

        timelineItem.put(
                "actor",
                "System"
        );

        timeline.add(timelineItem);

        response.put(
                "statusTimeline",
                timeline
        );

        // -----------------------------------------------------
        // Remarks
        // -----------------------------------------------------
        response.put(
                "remarks",
                new ArrayList<>()
        );

        return response;
    }

    // =========================================================
    // GET LOGGED-IN USER FROM TEMP TOKEN
    // =========================================================
    private User getUserFromToken(String authorization) {

        if (authorization == null ||
                !authorization.startsWith("Bearer ")) {

            return null;
        }

        String token =
                authorization.substring(7);

        if (!token.startsWith("dtcis-")) {
            return null;
        }

        int lastDash =
                token.lastIndexOf("-");

        if (lastDash == -1) {
            return null;
        }

        String email =
                token.substring(lastDash + 1);

        return userRepository
                .findByEmail(email)
                .orElse(null);
    }

    // =========================================================
    // FULL NAME
    // =========================================================
    private String getFullName(User user) {

        String first =
                user.getFirstName() == null
                        ? ""
                        : user.getFirstName();

        String last =
                user.getLastName() == null
                        ? ""
                        : user.getLastName();

        String full =
                (first + " " + last).trim();

        if (full.isEmpty()) {
            return user.getName();
        }

        return full;
    }
}
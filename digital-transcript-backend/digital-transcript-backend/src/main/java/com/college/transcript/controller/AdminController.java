package com.college.transcript.controller;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.college.transcript.User;
import com.college.transcript.entity.DocumentRequest;
import com.college.transcript.entity.Notification;
import com.college.transcript.repository.DocumentRequestRepository;
import com.college.transcript.repository.NotificationRepository;
import com.college.transcript.repository.UserRepository;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:5173")
public class AdminController {

    private final UserRepository userRepository;
    private final DocumentRequestRepository requestRepository;
    private final NotificationRepository notificationRepository;

    public AdminController(
            UserRepository userRepository,
            DocumentRequestRepository requestRepository,
            NotificationRepository notificationRepository) {

        this.userRepository = userRepository;
        this.requestRepository = requestRepository;
        this.notificationRepository = notificationRepository;
    }

    // =========================================================
    // DASHBOARD STATS
    // =========================================================

    @GetMapping("/dashboard/stats")
    public ResponseEntity<?> getDashboardStats() {

        List<DocumentRequest> requests = requestRepository.findAll();

        long total = requests.size();

        long pending = requests.stream()
                .filter(r -> "PENDING".equalsIgnoreCase(r.getStatus()))
                .count();

        long underReview = requests.stream()
                .filter(r -> "UNDER_REVIEW".equalsIgnoreCase(r.getStatus()))
                .count();

        long approved = requests.stream()
                .filter(r -> "APPROVED".equalsIgnoreCase(r.getStatus()))
                .count();

        long rejected = requests.stream()
                .filter(r -> "REJECTED".equalsIgnoreCase(r.getStatus()))
                .count();

        long documentGenerated = requests.stream()
                .filter(r ->
                        "DOCUMENT_GENERATED".equalsIgnoreCase(r.getStatus())
                        || "AVAILABLE".equalsIgnoreCase(r.getStatus()))
                .count();

        Map<String, Object> stats = new LinkedHashMap<>();

        stats.put("total", total);
        stats.put("pending", pending);
        stats.put("underReview", underReview);
        stats.put("approved", approved);
        stats.put("rejected", rejected);
        stats.put("documentGenerated", documentGenerated);

        return ResponseEntity.ok(stats);
    }

    // =========================================================
    // GET ALL REQUESTS
    // =========================================================

    @GetMapping("/requests")
    public ResponseEntity<?> getAllRequests(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String documentType,
            @RequestParam(required = false) String search) {

        List<DocumentRequest> requests = new ArrayList<>(requestRepository.findAll());

        // Sort newest first
        requests.sort(
                Comparator.comparing(
                        DocumentRequest::getUpdatedAt,
                        Comparator.nullsLast(Comparator.reverseOrder())
                )
        );

        // Status filter
        if (status != null && !status.isBlank()) {
            requests = requests.stream()
                    .filter(r -> status.equalsIgnoreCase(r.getStatus()))
                    .toList();
        }

        // Document type filter
        if (documentType != null && !documentType.isBlank()) {
            requests = requests.stream()
                    .filter(r -> documentType.equalsIgnoreCase(r.getDocumentType()))
                    .toList();
        }

        // Search filter
        if (search != null && !search.isBlank()) {

            String query = search.toLowerCase();

            requests = requests.stream()
                    .filter(r -> {

                        String requestRef =
                                r.getRequestRef() == null
                                        ? ""
                                        : r.getRequestRef().toLowerCase();

                        String purpose =
                                r.getPurpose() == null
                                        ? ""
                                        : r.getPurpose().toLowerCase();

                        String studentName = "";
                        String studentEmail = "";
                        String studentId = "";

                        if (r.getUser() != null) {

                            studentName =
                                    r.getUser().getName() == null
                                            ? ""
                                            : r.getUser().getName().toLowerCase();

                            studentEmail =
                                    r.getUser().getEmail() == null
                                            ? ""
                                            : r.getUser().getEmail().toLowerCase();

                            studentId =
                                    r.getUser().getStudentId() == null
                                            ? ""
                                            : r.getUser().getStudentId().toLowerCase();
                        }

                        return requestRef.contains(query)
                                || purpose.contains(query)
                                || studentName.contains(query)
                                || studentEmail.contains(query)
                                || studentId.contains(query);
                    })
                    .toList();
        }

        int totalElements = requests.size();

        int totalPages =
                size > 0
                        ? (int) Math.ceil((double) totalElements / size)
                        : 0;

        int safePage = Math.max(page, 0);
        int safeSize = Math.max(size, 1);

        int start = safePage * safeSize;

        List<DocumentRequest> pageItems;

        if (start >= totalElements) {
            pageItems = new ArrayList<>();
        } else {

            int end = Math.min(start + safeSize, totalElements);

            pageItems = requests.subList(start, end);
        }

        List<Map<String, Object>> content = new ArrayList<>();

        for (DocumentRequest request : pageItems) {
            content.add(convertRequestToResponse(request));
        }

        Map<String, Object> response = new LinkedHashMap<>();

        response.put("content", content);
        response.put("page", safePage);
        response.put("size", safeSize);
        response.put("totalElements", totalElements);
        response.put("totalPages", totalPages);

        return ResponseEntity.ok(response);
    }

    // =========================================================
    // GET REQUEST BY ID
    // =========================================================

    @GetMapping("/requests/{id}")
    public ResponseEntity<?> getRequestById(
            @PathVariable Long id) {

        Optional<DocumentRequest> optionalRequest =
                requestRepository.findById(id);

        if (optionalRequest.isEmpty()) {
            return ResponseEntity.status(404)
                    .body(Map.of("message", "Request not found"));
        }

        return ResponseEntity.ok(
                convertRequestToResponse(optionalRequest.get())
        );
    }

    // =========================================================
    // APPROVE REQUEST
    // =========================================================

    @PutMapping("/requests/{id}/approve")
    public ResponseEntity<?> approveRequest(
            @PathVariable Long id,
            @RequestBody(required = false) Map<String, Object> body) {

        Optional<DocumentRequest> optionalRequest =
                requestRepository.findById(id);

        if (optionalRequest.isEmpty()) {
            return ResponseEntity.status(404)
                    .body(Map.of("message", "Request not found"));
        }

        DocumentRequest request = optionalRequest.get();

        request.setStatus("APPROVED");
        request.setUpdatedAt(LocalDateTime.now());

        DocumentRequest savedRequest =
                requestRepository.save(request);

        // Create notification for student
        createNotification(
                request.getUser(),
                "Request Approved",
                "Your request " + request.getRequestRef()
                        + " has been approved."
        );

        return ResponseEntity.ok(
                convertRequestToResponse(savedRequest)
        );
    }

    // =========================================================
    // REJECT REQUEST
    // =========================================================

    @PutMapping("/requests/{id}/reject")
    public ResponseEntity<?> rejectRequest(
            @PathVariable Long id,
            @RequestBody(required = false) Map<String, Object> body) {

        Optional<DocumentRequest> optionalRequest =
                requestRepository.findById(id);

        if (optionalRequest.isEmpty()) {
            return ResponseEntity.status(404)
                    .body(Map.of("message", "Request not found"));
        }

        DocumentRequest request = optionalRequest.get();

        request.setStatus("REJECTED");
        request.setUpdatedAt(LocalDateTime.now());

        DocumentRequest savedRequest =
                requestRepository.save(request);

        String remark = "";

        if (body != null && body.get("remark") != null) {
            remark = String.valueOf(body.get("remark"));
        }

        String message =
                "Your request " + request.getRequestRef()
                        + " has been rejected.";

        if (!remark.isBlank()) {
            message += " Remark: " + remark;
        }

        createNotification(
                request.getUser(),
                "Request Rejected",
                message
        );

        return ResponseEntity.ok(
                convertRequestToResponse(savedRequest)
        );
    }

    // =========================================================
    // ADD REMARK
    // =========================================================

    @PostMapping("/requests/{id}/remarks")
    public ResponseEntity<?> addRemark(
            @PathVariable Long id,
            @RequestBody Map<String, Object> body) {

        Optional<DocumentRequest> optionalRequest =
                requestRepository.findById(id);

        if (optionalRequest.isEmpty()) {
            return ResponseEntity.status(404)
                    .body(Map.of("message", "Request not found"));
        }

        DocumentRequest request = optionalRequest.get();

        String remark =
                body == null || body.get("remark") == null
                        ? ""
                        : String.valueOf(body.get("remark"));

        if (remark.isBlank()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Remark cannot be empty"));
        }

        request.setUpdatedAt(LocalDateTime.now());

        DocumentRequest savedRequest =
                requestRepository.save(request);

        createNotification(
                request.getUser(),
                "New Remark Added",
                "An administrator added a remark to your request "
                        + request.getRequestRef() + "."
        );

        return ResponseEntity.ok(
                convertRequestToResponse(savedRequest)
        );
    }

    // =========================================================
    // GENERATE DOCUMENT
    // =========================================================

    @PutMapping("/requests/{id}/generate")
    public ResponseEntity<?> generateDocument(
            @PathVariable Long id) {

        Optional<DocumentRequest> optionalRequest =
                requestRepository.findById(id);

        if (optionalRequest.isEmpty()) {
            return ResponseEntity.status(404)
                    .body(Map.of("message", "Request not found"));
        }

        DocumentRequest request = optionalRequest.get();

        if (!"APPROVED".equalsIgnoreCase(request.getStatus())) {
            return ResponseEntity.badRequest()
                    .body(Map.of(
                            "message",
                            "Only approved requests can generate documents"
                    ));
        }

        request.setStatus("DOCUMENT_GENERATED");
        request.setUpdatedAt(LocalDateTime.now());

        DocumentRequest savedRequest =
                requestRepository.save(request);

        createNotification(
                request.getUser(),
                "Document Generated",
                "Your document for request "
                        + request.getRequestRef()
                        + " has been generated."
        );

        return ResponseEntity.ok(
                convertRequestToResponse(savedRequest)
        );
    }

    // =========================================================
    // MARK DOCUMENT AVAILABLE
    // =========================================================

    @PutMapping("/requests/{id}/available")
    public ResponseEntity<?> markAvailable(
            @PathVariable Long id) {

        Optional<DocumentRequest> optionalRequest =
                requestRepository.findById(id);

        if (optionalRequest.isEmpty()) {
            return ResponseEntity.status(404)
                    .body(Map.of("message", "Request not found"));
        }

        DocumentRequest request = optionalRequest.get();

        if (!"DOCUMENT_GENERATED".equalsIgnoreCase(request.getStatus())) {
            return ResponseEntity.badRequest()
                    .body(Map.of(
                            "message",
                            "Document must be generated first"
                    ));
        }

        request.setStatus("AVAILABLE");
        request.setUpdatedAt(LocalDateTime.now());

        DocumentRequest savedRequest =
                requestRepository.save(request);

        createNotification(
                request.getUser(),
                "Document Available",
                "Your document for request "
                        + request.getRequestRef()
                        + " is now available for download."
        );

        return ResponseEntity.ok(
                convertRequestToResponse(savedRequest)
        );
    }

    // =========================================================
    // GET ALL STUDENTS
    // =========================================================

    @GetMapping("/students")
    public ResponseEntity<?> getAllStudents(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String department) {

        List<User> students = userRepository.findAll()
                .stream()
                .filter(user ->
                        "STUDENT".equalsIgnoreCase(user.getRole()))
                .toList();

        if (department != null && !department.isBlank()) {

            students = students.stream()
                    .filter(user ->
                            department.equalsIgnoreCase(
                                    user.getDepartment()))
                    .toList();
        }

        if (search != null && !search.isBlank()) {

            String query = search.toLowerCase();

            students = students.stream()
                    .filter(user -> {

                        String name =
                                user.getName() == null
                                        ? ""
                                        : user.getName().toLowerCase();

                        String email =
                                user.getEmail() == null
                                        ? ""
                                        : user.getEmail().toLowerCase();

                        String studentId =
                                user.getStudentId() == null
                                        ? ""
                                        : user.getStudentId().toLowerCase();

                        String course =
                                user.getCourse() == null
                                        ? ""
                                        : user.getCourse().toLowerCase();

                        return name.contains(query)
                                || email.contains(query)
                                || studentId.contains(query)
                                || course.contains(query);
                    })
                    .toList();
        }

        int totalElements = students.size();

        int safePage = Math.max(page, 0);
        int safeSize = Math.max(size, 1);

        int start = safePage * safeSize;

        List<User> pageItems;

        if (start >= totalElements) {
            pageItems = new ArrayList<>();
        } else {
            int end = Math.min(start + safeSize, totalElements);
            pageItems = students.subList(start, end);
        }

        List<Map<String, Object>> content = new ArrayList<>();

        for (User student : pageItems) {

            Map<String, Object> item = new LinkedHashMap<>();

            item.put("id", String.valueOf(student.getId()));
            item.put("studentId", student.getStudentId());
            item.put("firstName", student.getFirstName());
            item.put("lastName", student.getLastName());
            item.put("email", student.getEmail());
            item.put("course", student.getCourse());
            item.put("department", student.getDepartment());
            item.put("yearOfStudy", student.getYearOfStudy());
            item.put("status", "ACTIVE");

            content.add(item);
        }

        int totalPages =
                (int) Math.ceil(
                        (double) totalElements / safeSize
                );

        Map<String, Object> response = new LinkedHashMap<>();

        response.put("content", content);
        response.put("page", safePage);
        response.put("size", safeSize);
        response.put("totalElements", totalElements);
        response.put("totalPages", totalPages);

        return ResponseEntity.ok(response);
    }

    // =========================================================
    // GET ALL GENERATED DOCUMENTS
    // =========================================================

    @GetMapping("/documents")
    public ResponseEntity<?> getAllDocuments(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String search) {

        List<DocumentRequest> generatedRequests =
                requestRepository.findAll()
                        .stream()
                        .filter(request ->
                                "DOCUMENT_GENERATED".equalsIgnoreCase(
                                        request.getStatus())
                                ||
                                "AVAILABLE".equalsIgnoreCase(
                                        request.getStatus()))
                        .sorted(
                                Comparator.comparing(
                                        DocumentRequest::getUpdatedAt,
                                        Comparator.nullsLast(
                                                Comparator.reverseOrder()))
                        )
                        .toList();

        if (search != null && !search.isBlank()) {

            String query = search.toLowerCase();

            generatedRequests = generatedRequests.stream()
                    .filter(request -> {

                        String requestRef =
                                request.getRequestRef() == null
                                        ? ""
                                        : request.getRequestRef()
                                                .toLowerCase();

                        String documentType =
                                request.getDocumentType() == null
                                        ? ""
                                        : request.getDocumentType()
                                                .toLowerCase();

                        String studentName = "";

                        if (request.getUser() != null) {
                            studentName =
                                    request.getUser().getName() == null
                                            ? ""
                                            : request.getUser()
                                                    .getName()
                                                    .toLowerCase();
                        }

                        return requestRef.contains(query)
                                || documentType.contains(query)
                                || studentName.contains(query);
                    })
                    .toList();
        }

        int totalElements = generatedRequests.size();

        int safePage = Math.max(page, 0);
        int safeSize = Math.max(size, 1);

        int start = safePage * safeSize;

        List<DocumentRequest> pageItems;

        if (start >= totalElements) {
            pageItems = new ArrayList<>();
        } else {
            int end = Math.min(start + safeSize, totalElements);
            pageItems = generatedRequests.subList(start, end);
        }

        List<Map<String, Object>> content = new ArrayList<>();

        for (DocumentRequest request : pageItems) {

            Map<String, Object> document =
                    new LinkedHashMap<>();

            document.put(
                    "id",
                    String.valueOf(request.getId())
            );

            document.put(
                    "documentRef",
                    "DOC-" + request.getRequestRef()
            );

            document.put(
                    "requestRef",
                    request.getRequestRef()
            );

            document.put(
                    "studentName",
                    request.getUser() != null
                            ? request.getUser().getName()
                            : ""
            );

            document.put(
                    "studentEmail",
                    request.getUser() != null
                            ? request.getUser().getEmail()
                            : ""
            );

            document.put(
                    "documentType",
                    request.getDocumentType()
            );

            document.put(
                    "status",
                    request.getStatus()
            );

            document.put(
                    "generatedAt",
                    request.getUpdatedAt()
            );

            content.add(document);
        }

        int totalPages =
                (int) Math.ceil(
                        (double) totalElements / safeSize
                );

        Map<String, Object> response =
                new LinkedHashMap<>();

        response.put("content", content);
        response.put("page", safePage);
        response.put("size", safeSize);
        response.put("totalElements", totalElements);
        response.put("totalPages", totalPages);

        return ResponseEntity.ok(response);
    }

    // =========================================================
    // AUDIT LOGS
    // =========================================================

    @GetMapping("/audit-logs")
    public ResponseEntity<?> getAuditLogs(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String action) {

        /*
         * There is currently no AuditLog entity/table in the backend.
         *
         * Therefore we create activity records from the real
         * document_requests table instead of returning fake/mock logs.
         */

        List<DocumentRequest> requests =
                requestRepository.findAll()
                        .stream()
                        .sorted(
                                Comparator.comparing(
                                        DocumentRequest::getUpdatedAt,
                                        Comparator.nullsLast(
                                                Comparator.reverseOrder()))
                        )
                        .toList();

        List<Map<String, Object>> logs = new ArrayList<>();

        for (DocumentRequest request : requests) {

            Map<String, Object> log =
                    new LinkedHashMap<>();

            log.put(
                    "id",
                    "request-" + request.getId()
            );

            String studentName =
                    request.getUser() != null
                            ? request.getUser().getName()
                            : "System";

            log.put("userName", studentName);

            String logAction;

            if ("PENDING".equalsIgnoreCase(request.getStatus())) {
                logAction = "REQUEST_SUBMITTED";
            } else if ("UNDER_REVIEW".equalsIgnoreCase(request.getStatus())) {
                logAction = "REQUEST_UNDER_REVIEW";
            } else if ("APPROVED".equalsIgnoreCase(request.getStatus())) {
                logAction = "REQUEST_APPROVED";
            } else if ("REJECTED".equalsIgnoreCase(request.getStatus())) {
                logAction = "REQUEST_REJECTED";
            } else if ("DOCUMENT_GENERATED".equalsIgnoreCase(request.getStatus())) {
                logAction = "DOCUMENT_GENERATED";
            } else if ("AVAILABLE".equalsIgnoreCase(request.getStatus())) {
                logAction = "DOCUMENT_AVAILABLE";
            } else {
                logAction = "REQUEST_UPDATED";
            }

            log.put("action", logAction);
            log.put("entityId", request.getRequestRef());

            log.put(
                    "details",
                    "Request " + request.getRequestRef()
                            + " is currently "
                            + request.getStatus()
            );

            log.put(
                    "timestamp",
                    request.getUpdatedAt() != null
                            ? request.getUpdatedAt()
                            : request.getSubmittedAt()
            );

            logs.add(log);
        }

        if (action != null && !action.isBlank()) {

            logs = logs.stream()
                    .filter(log ->
                            action.equalsIgnoreCase(
                                    String.valueOf(
                                            log.get("action"))))
                    .toList();
        }

        if (search != null && !search.isBlank()) {

            String query = search.toLowerCase();

            logs = logs.stream()
                    .filter(log ->
                            String.valueOf(
                                    log.get("userName"))
                                    .toLowerCase()
                                    .contains(query)
                            ||
                            String.valueOf(
                                    log.get("action"))
                                    .toLowerCase()
                                    .contains(query)
                            ||
                            String.valueOf(
                                    log.get("entityId"))
                                    .toLowerCase()
                                    .contains(query)
                            ||
                            String.valueOf(
                                    log.get("details"))
                                    .toLowerCase()
                                    .contains(query))
                    .toList();
        }

        int totalElements = logs.size();

        int safePage = Math.max(page, 0);
        int safeSize = Math.max(size, 1);

        int start = safePage * safeSize;

        List<Map<String, Object>> pageItems;

        if (start >= totalElements) {
            pageItems = new ArrayList<>();
        } else {

            int end =
                    Math.min(
                            start + safeSize,
                            totalElements);

            pageItems = logs.subList(start, end);
        }

        int totalPages =
                (int) Math.ceil(
                        (double) totalElements / safeSize
                );

        Map<String, Object> response =
                new LinkedHashMap<>();

        response.put("content", pageItems);
        response.put("page", safePage);
        response.put("size", safeSize);
        response.put("totalElements", totalElements);
        response.put("totalPages", totalPages);

        return ResponseEntity.ok(response);
    }

    // =========================================================
    // CONVERT DATABASE REQUEST TO FRONTEND FORMAT
    // =========================================================

    private Map<String, Object> convertRequestToResponse(
            DocumentRequest request) {

        Map<String, Object> result =
                new LinkedHashMap<>();

        result.put(
                "id",
                String.valueOf(request.getId())
        );

        result.put(
                "requestRef",
                request.getRequestRef()
        );

        User student = request.getUser();

        if (student != null) {

            result.put(
                    "studentId",
                    student.getStudentId()
            );

            result.put(
                    "studentName",
                    student.getName()
            );

            result.put(
                    "studentEmail",
                    student.getEmail()
            );

            result.put(
                    "studentCourse",
                    student.getCourse()
            );

            result.put(
                    "studentDepartment",
                    student.getDepartment()
            );

            result.put(
                    "course",
                    student.getCourse()
            );

            result.put(
                    "department",
                    student.getDepartment()
            );
        } else {

            result.put("studentId", "");
            result.put("studentName", "");
            result.put("studentEmail", "");
            result.put("studentCourse", "");
            result.put("studentDepartment", "");
            result.put("course", "");
            result.put("department", "");
        }

        result.put(
                "documentType",
                request.getDocumentType()
        );

        result.put(
                "purpose",
                request.getPurpose()
        );

        result.put(
                "numberOfCopies",
                request.getNumberOfCopies()
        );

        result.put(
                "additionalInfo",
                request.getAdditionalInfo()
        );

        result.put(
                "status",
                request.getStatus()
        );

        result.put(
                "submittedAt",
                request.getSubmittedAt()
        );

        result.put(
                "updatedAt",
                request.getUpdatedAt()
        );

        List<String> supportingDocuments =
                new ArrayList<>();

        if (request.getSupportingDocuments() != null
                && !request.getSupportingDocuments().isBlank()) {

            String[] files =
                    request.getSupportingDocuments()
                            .split(",");

            for (String file : files) {
                if (!file.isBlank()) {
                    supportingDocuments.add(file.trim());
                }
            }
        }

        result.put(
                "supportingDocuments",
                supportingDocuments
        );

        /*
         * At present, status history and remarks do not have
         * separate database tables. We return the current status
         * as a timeline entry so the frontend receives the expected
         * structure.
         */

        List<Map<String, Object>> timeline =
                new ArrayList<>();

        if (request.getStatus() != null) {

            Map<String, Object> event =
                    new LinkedHashMap<>();

            event.put(
                    "id",
                    "status-" + request.getId()
            );

            event.put(
                    "status",
                    request.getStatus()
            );

            event.put(
                    "timestamp",
                    request.getUpdatedAt() != null
                            ? request.getUpdatedAt()
                            : request.getSubmittedAt()
            );

            event.put(
                    "actor",
                    "System"
            );

            timeline.add(event);
        }

        result.put(
                "statusTimeline",
                timeline
        );

        result.put(
                "remarks",
                new ArrayList<>()
        );

        return result;
    }

    // =========================================================
    // CREATE STUDENT NOTIFICATION
    // =========================================================

    private void createNotification(
            User user,
            String title,
            String message) {

        if (user == null) {
            return;
        }

        Notification notification =
                new Notification();

        notification.setUser(user);
        notification.setTitle(title);
        notification.setMessage(message);
        notification.setRead(false);
        notification.setCreatedAt(LocalDateTime.now());

        notificationRepository.save(notification);
    }
}
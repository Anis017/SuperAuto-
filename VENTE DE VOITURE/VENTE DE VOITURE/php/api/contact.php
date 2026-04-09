<?php
/*
 * Contact Messages API Endpoint
 * 
 * Handles contact form submissions
 * GET /api/contact.php - Get all contact messages (admin only)
 * POST /api/contact.php - Create new contact message
 * PUT /api/contact.php - Update message status (admin only)
 * DELETE /api/contact.php - Delete message (admin only)
 */

require_once '../config.php';

$method = $_SERVER['REQUEST_METHOD'];
$pdo = getDBConnection();

switch ($method) {
    case 'GET':
        handleGetMessages($pdo);
        break;
    case 'POST':
        handleCreateMessage($pdo);
        break;
    case 'PUT':
        handleUpdateMessage($pdo);
        break;
    case 'DELETE':
        handleDeleteMessage($pdo);
        break;
    default:
        sendJSONResponse(['error' => 'Method not allowed'], 405);
}

function handleGetMessages($pdo) {
    try {
        // Admin check
        $isAdmin = $_GET['admin_token'] === 'admin123' || $_SESSION['admin_logged_in'] ?? false;
        if (!$isAdmin) {
            sendJSONResponse(['error' => 'Unauthorized'], 401);
        }
        
        $status = $_GET['status'] ?? null;
        
        $sql = "SELECT * FROM contact_messages";
        $params = [];
        
        if ($status && in_array($status, ['unread', 'read', 'replied'])) {
            $sql .= " WHERE status = ?";
            $params[] = $status;
        }
        
        $sql .= " ORDER BY created_at DESC";
        
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        $messages = $stmt->fetchAll();
        
        sendJSONResponse($messages);
        
    } catch (Exception $e) {
        handleError("Error fetching messages: " . $e->getMessage());
    }
}

function handleCreateMessage($pdo) {
    try {
        $firstName = sanitizeInput($_POST['first_name']);
        $lastName = sanitizeInput($_POST['last_name']);
        $email = sanitizeInput($_POST['email']);
        $phone = sanitizeInput($_POST['phone'] ?? '');
        $subject = sanitizeInput($_POST['subject']);
        $message = sanitizeInput($_POST['message']);
        $newsletter = isset($_POST['newsletter']) && $_POST['newsletter'] === 'on';
        
        // Validation
        if (empty($firstName) || empty($lastName) || empty($email) || empty($subject) || empty($message)) {
            sendJSONResponse(['error' => 'All required fields must be filled'], 400);
        }
        
        if (!validateEmail($email)) {
            sendJSONResponse(['error' => 'Invalid email address'], 400);
        }
        
        if ($phone && !validatePhone($phone)) {
            sendJSONResponse(['error' => 'Invalid phone number'], 400);
        }
        
        if (strlen($message) < 10) {
            sendJSONResponse(['error' => 'Message must be at least 10 characters long'], 400);
        }
        
        $validSubjects = ['General Inquiry', 'Car Purchase', 'Test Drive', 'Service', 'Financing', 'Other'];
        if (!in_array($subject, $validSubjects)) {
            sendJSONResponse(['error' => 'Invalid subject'], 400);
        }
        
        $sql = "INSERT INTO contact_messages (first_name, last_name, email, phone, subject, message, newsletter) 
                VALUES (?, ?, ?, ?, ?, ?, ?)";
        
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$firstName, $lastName, $email, $phone, $subject, $message, $newsletter]);
        
        $messageId = $pdo->lastInsertId();
        
        // In a real application, you would send an email notification here
        
        sendJSONResponse([
            'success' => true, 
            'id' => $messageId, 
            'message' => 'Thank you for your message! We will get back to you within 24 hours.'
        ], 201);
        
    } catch (Exception $e) {
        handleError("Error creating message: " . $e->getMessage());
    }
}

function handleUpdateMessage($pdo) {
    try {
        // Admin check
        $isAdmin = $_POST['admin_token'] === 'admin123' || $_SESSION['admin_logged_in'] ?? false;
        if (!$isAdmin) {
            sendJSONResponse(['error' => 'Unauthorized'], 401);
        }
        
        $messageId = intval($_POST['id']);
        $status = sanitizeInput($_POST['status']);
        
        if ($messageId <= 0) {
            sendJSONResponse(['error' => 'Invalid message ID'], 400);
        }
        
        if (!in_array($status, ['unread', 'read', 'replied'])) {
            sendJSONResponse(['error' => 'Invalid status'], 400);
        }
        
        $stmt = $pdo->prepare("UPDATE contact_messages SET status = ? WHERE id = ?");
        $result = $stmt->execute([$status, $messageId]);
        
        if ($stmt->rowCount() === 0) {
            sendJSONResponse(['error' => 'Message not found'], 404);
        }
        
        sendJSONResponse(['success' => true, 'message' => 'Message status updated successfully']);
        
    } catch (Exception $e) {
        handleError("Error updating message: " . $e->getMessage());
    }
}

function handleDeleteMessage($pdo) {
    try {
        // Admin check
        $isAdmin = $_POST['admin_token'] === 'admin123' || $_SESSION['admin_logged_in'] ?? false;
        if (!$isAdmin) {
            sendJSONResponse(['error' => 'Unauthorized'], 401);
        }
        
        $messageId = intval($_POST['id'] ?? $_GET['id'] ?? 0);
        
        if ($messageId <= 0) {
            sendJSONResponse(['error' => 'Invalid message ID'], 400);
        }
        
        $stmt = $pdo->prepare("DELETE FROM contact_messages WHERE id = ?");
        $result = $stmt->execute([$messageId]);
        
        if ($stmt->rowCount() === 0) {
            sendJSONResponse(['error' => 'Message not found'], 404);
        }
        
        sendJSONResponse(['success' => true, 'message' => 'Message deleted successfully']);
        
    } catch (Exception $e) {
        handleError("Error deleting message: " . $e->getMessage());
    }
}
?>
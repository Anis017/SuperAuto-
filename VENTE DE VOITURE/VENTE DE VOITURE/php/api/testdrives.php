<?php
/*
 * Test Drive Requests API Endpoint
 * 
 * Handles test drive booking requests
 * GET /api/test-drives.php - Get all test drive requests (admin only)
 * POST /api/test-drives.php - Create new test drive request
 * PUT /api/test-drives.php - Update test drive request status (admin only)
 * DELETE /api/test-drives.php - Delete test drive request (admin only)
 */

require_once '../config.php';

$method = $_SERVER['REQUEST_METHOD'];
$pdo = getDBConnection();

switch ($method) {
    case 'GET':
        handleGetTestDrives($pdo);
        break;
    case 'POST':
        handleCreateTestDrive($pdo);
        break;
    case 'PUT':
        handleUpdateTestDrive($pdo);
        break;
    case 'DELETE':
        handleDeleteTestDrive($pdo);
        break;
    default:
        sendJSONResponse(['error' => 'Method not allowed'], 405);
}

function handleGetTestDrives($pdo) {
    try {
        // Admin check
        $isAdmin = $_GET['admin_token'] === 'admin123' || $_SESSION['admin_logged_in'] ?? false;
        if (!$isAdmin) {
            sendJSONResponse(['error' => 'Unauthorized'], 401);
        }
        
        $sql = "SELECT td.*, c.brand, c.model 
                FROM test_drive_requests td 
                LEFT JOIN cars c ON td.car_id = c.id 
                ORDER BY td.created_at DESC";
        
        $stmt = $pdo->prepare($sql);
        $stmt->execute();
        $requests = $stmt->fetchAll();
        
        // Add car name for easier display
        foreach ($requests as &$request) {
            $request['car_name'] = ($request['brand'] && $request['model']) 
                ? $request['brand'] . ' ' . $request['model'] 
                : 'Unknown Car';
        }
        
        sendJSONResponse($requests);
        
    } catch (Exception $e) {
        handleError("Error fetching test drive requests: " . $e->getMessage());
    }
}

function handleCreateTestDrive($pdo) {
    try {
        $name = sanitizeInput($_POST['name']);
        $email = sanitizeInput($_POST['email']);
        $phone = sanitizeInput($_POST['phone']);
        $carId = intval($_POST['car_id']);
        $preferredDate = sanitizeInput($_POST['preferred_date']);
        $message = sanitizeInput($_POST['message'] ?? '');
        
        // Validation
        if (empty($name) || empty($email) || empty($phone) || $carId <= 0 || empty($preferredDate)) {
            sendJSONResponse(['error' => 'All required fields must be filled'], 400);
        }
        
        if (!validateEmail($email)) {
            sendJSONResponse(['error' => 'Invalid email address'], 400);
        }
        
        if (!validatePhone($phone)) {
            sendJSONResponse(['error' => 'Invalid phone number'], 400);
        }
        
        // Check if car exists
        $stmt = $pdo->prepare("SELECT id FROM cars WHERE id = ?");
        $stmt->execute([$carId]);
        if (!$stmt->fetch()) {
            sendJSONResponse(['error' => 'Car not found'], 404);
        }
        
        // Check if date is in the future
        $selectedDate = new DateTime($preferredDate);
        $today = new DateTime();
        $today->setTime(0, 0, 0);
        
        if ($selectedDate < $today) {
            sendJSONResponse(['error' => 'Preferred date must be in the future'], 400);
        }
        
        $sql = "INSERT INTO test_drive_requests (name, email, phone, car_id, preferred_date, message) 
                VALUES (?, ?, ?, ?, ?, ?)";
        
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$name, $email, $phone, $carId, $preferredDate, $message]);
        
        $requestId = $pdo->lastInsertId();
        
        // In a real application, you would send an email notification here
        
        sendJSONResponse([
            'success' => true, 
            'id' => $requestId, 
            'message' => 'Test drive request submitted successfully! We will contact you soon.'
        ], 201);
        
    } catch (Exception $e) {
        handleError("Error creating test drive request: " . $e->getMessage());
    }
}

function handleUpdateTestDrive($pdo) {
    try {
        // Admin check
        $isAdmin = $_POST['admin_token'] === 'admin123' || $_SESSION['admin_logged_in'] ?? false;
        if (!$isAdmin) {
            sendJSONResponse(['error' => 'Unauthorized'], 401);
        }
        
        $requestId = intval($_POST['id']);
        $status = sanitizeInput($_POST['status']);
        
        if ($requestId <= 0) {
            sendJSONResponse(['error' => 'Invalid request ID'], 400);
        }
        
        if (!in_array($status, ['pending', 'confirmed', 'completed', 'cancelled'])) {
            sendJSONResponse(['error' => 'Invalid status'], 400);
        }
        
        $stmt = $pdo->prepare("UPDATE test_drive_requests SET status = ? WHERE id = ?");
        $result = $stmt->execute([$status, $requestId]);
        
        if ($stmt->rowCount() === 0) {
            sendJSONResponse(['error' => 'Request not found'], 404);
        }
        
        sendJSONResponse(['success' => true, 'message' => 'Request status updated successfully']);
        
    } catch (Exception $e) {
        handleError("Error updating test drive request: " . $e->getMessage());
    }
}

function handleDeleteTestDrive($pdo) {
    try {
        // Admin check
        $isAdmin = $_POST['admin_token'] === 'admin123' || $_SESSION['admin_logged_in'] ?? false;
        if (!$isAdmin) {
            sendJSONResponse(['error' => 'Unauthorized'], 401);
        }
        
        $requestId = intval($_POST['id'] ?? $_GET['id'] ?? 0);
        
        if ($requestId <= 0) {
            sendJSONResponse(['error' => 'Invalid request ID'], 400);
        }
        
        $stmt = $pdo->prepare("DELETE FROM test_drive_requests WHERE id = ?");
        $result = $stmt->execute([$requestId]);
        
        if ($stmt->rowCount() === 0) {
            sendJSONResponse(['error' => 'Request not found'], 404);
        }
        
        sendJSONResponse(['success' => true, 'message' => 'Test drive request deleted successfully']);
        
    } catch (Exception $e) {
        handleError("Error deleting test drive request: " . $e->getMessage());
    }
}
?>
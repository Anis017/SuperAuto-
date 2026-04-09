<?php

require_once '../config.php';

$method = $_SERVER['REQUEST_METHOD'];
$pdo = getDBConnection();

switch ($method) {
    case 'GET':
        handleGetCars($pdo);
        break;
    case 'POST':
        handleCreateCar($pdo);
        break;
    case 'PUT':
        handleUpdateCar($pdo);
        break;
    case 'DELETE':
        handleDeleteCar($pdo);
        break;
    default:
        sendJSONResponse(['error' => 'Method not allowed'], 405);
}

function handleGetCars($pdo) {
    try {
        $carId = $_GET['id'] ?? null;
        
        
        if ($carId) {
            // Get specific car
            $stmt = $pdo->prepare("SELECT * FROM cars WHERE id = ?");
            $stmt->execute([$carId]);
            $car = $stmt->fetch();
            
            if (!$car) {
                sendJSONResponse(['error' => 'Car not found'], 404);
            }
            
            // Parse gallery JSON
            if ($car['gallery']) {
                $car['gallery'] = json_decode($car['gallery'], true);
            }
            
            sendJSONResponse($car);
        } else {
            // Get all cars with optional filtering
            $brand = $_GET['brand'] ?? null;
            $minPrice = $_GET['min_price'] ?? null;
            $maxPrice = $_GET['max_price'] ?? null;
            $year = $_GET['year'] ?? null;
            $fuelType = $_GET['fuel_type'] ?? null;
            $search = $_GET['search'] ?? null;
            
            $sql = "SELECT * FROM cars WHERE 1=1";
            $params = [];
            
            if ($brand) {
                $sql .= " AND brand = ?";
                $params[] = $brand;
            }
            
            if ($minPrice) {
                $sql .= " AND price >= ?";
                $params[] = $minPrice;
            }
            
            if ($maxPrice) {
                $sql .= " AND price <= ?";
                $params[] = $maxPrice;
            }
            
            if ($year) {
                $sql .= " AND year = ?";
                $params[] = $year;
            }
            
            if ($fuelType) {
                $sql .= " AND fuel_type = ?";
                $params[] = $fuelType;
            }
            
            if ($search) {
                $sql .= " AND (brand LIKE ? OR model LIKE ? OR description LIKE ?)";
                $searchTerm = "%$search%";
                $params[] = $searchTerm;
                $params[] = $searchTerm;
                $params[] = $searchTerm;
            }
            
            $sql .= " ORDER BY created_at DESC";
            
            $stmt = $pdo->prepare($sql);
            $stmt->execute($params);
            $cars = $stmt->fetchAll();
            
            // Parse gallery JSON for each car
            foreach ($cars as &$car) {
                if ($car['gallery']) {
                    $car['gallery'] = json_decode($car['gallery'], true);
                }
            }
            
            sendJSONResponse($cars);
        }
    } catch (Exception $e) {
        handleError("Error fetching cars: " . $e->getMessage());
    }
}

function handleCreateCar($pdo) {
    try {
        // Simple admin check (in production, use proper authentication)
        $isAdmin = $_POST['admin_token'] === 'admin123' || $_SESSION['admin_logged_in'] ?? false;
        if (!$isAdmin) {
            sendJSONResponse(['error' => 'Unauthorized'], 401);
        }
        
        $brand = sanitizeInput($_POST['brand']);
        $model = sanitizeInput($_POST['model']);
        $price = floatval($_POST['price']);
        $image = sanitizeInput($_POST['image']);
        $description = sanitizeInput($_POST['description']);
        $year = intval($_POST['year']);
        $fuelType = sanitizeInput($_POST['fuel_type']);
        $mileage = intval($_POST['mileage'] ?? 0);
        $horsepower = intval($_POST['horsepower'] ?? 0);
        $topSpeed = intval($_POST['top_speed'] ?? 0);
        $acceleration = sanitizeInput($_POST['acceleration'] ?? '');
        $gallery = json_encode([$image]); // Simple gallery with main image
        
        // Validation
        if (empty($brand) || empty($model) || $price <= 0 || empty($image) || empty($description) || $year < 1900) {
            sendJSONResponse(['error' => 'Invalid input data'], 400);
        }
        
        if (!in_array($fuelType, ['Petrol', 'Hybrid', 'Electric'])) {
            sendJSONResponse(['error' => 'Invalid fuel type'], 400);
        }
        
        $sql = "INSERT INTO cars (brand, model, price, image, description, year, fuel_type, mileage, horsepower, top_speed, acceleration, gallery) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$brand, $model, $price, $image, $description, $year, $fuelType, $mileage, $horsepower, $topSpeed, $acceleration, $gallery]);
        
        $carId = $pdo->lastInsertId();
        
        sendJSONResponse(['success' => true, 'id' => $carId, 'message' => 'Car created successfully'], 201);
        
    } catch (Exception $e) {
        handleError("Error creating car: " . $e->getMessage());
    }
}

function handleUpdateCar($pdo) {
    try {
        // Simple admin check
        $isAdmin = $_POST['admin_token'] === 'admin123' || $_SESSION['admin_logged_in'] ?? false;
        if (!$isAdmin) {
            sendJSONResponse(['error' => 'Unauthorized'], 401);
        }
        
        $carId = intval($_POST['id']);
        $brand = sanitizeInput($_POST['brand']);
        $model = sanitizeInput($_POST['model']);
        $price = floatval($_POST['price']);
        $image = sanitizeInput($_POST['image']);
        $description = sanitizeInput($_POST['description']);
        $year = intval($_POST['year']);
        $fuelType = sanitizeInput($_POST['fuel_type']);
        $mileage = intval($_POST['mileage'] ?? 0);
        $horsepower = intval($_POST['horsepower'] ?? 0);
        $topSpeed = intval($_POST['top_speed'] ?? 0);
        $acceleration = sanitizeInput($_POST['acceleration'] ?? '');
        $gallery = json_encode([$image]);
        
        // Validation
        if ($carId <= 0 || empty($brand) || empty($model) || $price <= 0 || empty($image) || empty($description) || $year < 1900) {
            sendJSONResponse(['error' => 'Invalid input data'], 400);
        }
        
        if (!in_array($fuelType, ['Petrol', 'Hybrid', 'Electric'])) {
            sendJSONResponse(['error' => 'Invalid fuel type'], 400);
        }
        
        $sql = "UPDATE cars SET brand=?, model=?, price=?, image=?, description=?, year=?, fuel_type=?, mileage=?, horsepower=?, top_speed=?, acceleration=?, gallery=?, updated_at=CURRENT_TIMESTAMP WHERE id=?";
        
        $stmt = $pdo->prepare($sql);
        $result = $stmt->execute([$brand, $model, $price, $image, $description, $year, $fuelType, $mileage, $horsepower, $topSpeed, $acceleration, $gallery, $carId]);
        
        if ($stmt->rowCount() === 0) {
            sendJSONResponse(['error' => 'Car not found or no changes made'], 404);
        }
        
        sendJSONResponse(['success' => true, 'message' => 'Car updated successfully']);
        
    } catch (Exception $e) {
        handleError("Error updating car: " . $e->getMessage());
    }
}

function handleDeleteCar($pdo) {
    try {
        // Simple admin check
        $isAdmin = $_POST['admin_token'] === 'admin123' || $_SESSION['admin_logged_in'] ?? false;
        if (!$isAdmin) {
            sendJSONResponse(['error' => 'Unauthorized'], 401);
        }
        
        $carId = intval($_POST['id'] ?? $_GET['id'] ?? 0);
        
        if ($carId <= 0) {
            sendJSONResponse(['error' => 'Invalid car ID'], 400);
        }
        
        $stmt = $pdo->prepare("DELETE FROM cars WHERE id = ?");
        $result = $stmt->execute([$carId]);
        
        if ($stmt->rowCount() === 0) {
            sendJSONResponse(['error' => 'Car not found'], 404);
        }
        
        sendJSONResponse(['success' => true, 'message' => 'Car deleted successfully']);
        
    } catch (Exception $e) {
        handleError("Error deleting car: " . $e->getMessage());
    }
}
?>
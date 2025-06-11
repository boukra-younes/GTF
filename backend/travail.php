<?php
// Add these headers at the very top
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");
header("Access-Control-Allow-Credentials: true");

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

session_start();
include('config.php');


if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    exit(json_encode(['success' => false, 'message' => 'Method not allowed']));
}

// Verify user is logged in
if (!isset($_SESSION['user'])) {
    http_response_code(401);
    exit(json_encode(['success' => false, 'message' => 'Unauthorized']));
}

// Get form data
$data = json_decode(file_get_contents('php://input'), true);

// Validate required fields
$required = ['title', 'description', 'start_date', 'end_date'];
foreach ($required as $field) {
    if (empty($data[$field])) {
        http_response_code(400);
        exit(json_encode(['success' => false, 'message' => "Missing required field: $field"]));
    }
}

try {
    // Prepare SQL statement
    $stmt = $conn->prepare("INSERT INTO travail 
        (responsable_id, titre, description, date_debut, date_fin, status, created_at,location)
        VALUES (?, ?, ?, ?, ?,  'pending', NOW(),?)");

    $stmt->bind_param("isssss", 
        $_SESSION['user']['id'],
        $data['title'],
        $data['description'],
        $data['start_date'],
        $data['end_date'],
        $data['location']
    );

    if ($stmt->execute()) {
        // Log activity
        include('log_activity.php');
        logUserActivity($_SESSION['user']['id'], 'travail_created', 
            "Created new travail: " . $data['title']);

        echo json_encode([
            'success' => true,
            'id' => $stmt->insert_id,
            'message' => 'Travail created successfully'
        ]);
    } else {
        throw new Exception($stmt->error);
    }
} catch (Exception $e) {
    http_response_code(500);
    error_log($e->getMessage());
    echo json_encode([
        'success' => false,
        'message' => 'Error creating travail: ' . $e->getMessage()
    ]);
}

$conn->close();
?>
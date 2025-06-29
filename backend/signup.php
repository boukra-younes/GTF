<?php

// CORS headers
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json");

// Handle preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

include('config.php');
include('notifications/create_notification.php');
include('log_activity.php');

// Get raw input
$input = file_get_contents("php://input");
$data = json_decode($input);

// Check if JSON is valid and required fields exist
if (!$data || !isset($data->name) || !isset($data->email) || !isset($data->password)||!isset($data->accountType)) {
    http_response_code(400);
    echo json_encode(["error" => "Invalid input data"]);
    exit();
}

$name = $data->name;
$email = $data->email;
$password = password_hash($data->password, PASSWORD_DEFAULT);
$role = $data->accountType;

// Check if email already exists
$stmt = $conn->prepare("SELECT * FROM users WHERE email = ?");
if (!$stmt) {
    http_response_code(500);
    echo json_encode(["error" => "Failed to prepare SELECT statement"]);
    exit();
}
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    echo json_encode(["error" => "Email already exists"]);
    exit();
}

// Insert new user
$stmt = $conn->prepare("INSERT INTO users (fname, email, password, role, status) VALUES (?, ?, ?, ?, 'pending')");

if (!$stmt) {
    http_response_code(500);
    echo json_encode(["error" => "Failed to prepare INSERT statement"]);
    exit();
}
$stmt->bind_param("ssss", $name, $email, $password, $role);

if ($stmt->execute()) {
    // Get the new user's ID
    $newUserId = $conn->insert_id;
      if($role == 'agent'){
        $stmt = $conn->prepare("INSERT INTO agents (agent_id , status) VALUES (?,  'free')");
        
        if (!$stmt) {
            http_response_code(500);
            echo json_encode(["error" => "Failed to prepare INSERT statement"]);
            exit();
        }
        $stmt->bind_param("i", $newUserId );
        $stmt->execute();
      }
         
    // Log the signup activity
    logUserActivity($newUserId, 'signup', 'New user registration');
    
    // Create notification for all admins
    $message = "New user registration: " . $name . " (" . $email . ")";
    notifyAllAdmins($message);
    
    echo json_encode(["message" => "Signup successful. Your account is pending admin approval."]);
} else {
    http_response_code(500);
    echo json_encode(["error" => "Signup failed: " . $stmt->error]);
}

$conn->close();
?>

<?php
session_start();

include('config.php');

// Check if user is logged in
if (!isset($_SESSION['user'])) {
    echo json_encode(["success" => false, "message" => "User not logged in"]);
    exit();
}

// Get user ID from session
$userId = $_SESSION['user']['id'];

// Fetch user data from database
$stmt = $conn->prepare("SELECT id, fname, email, role, status FROM users WHERE id = ?");
$stmt->bind_param("i", $userId);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    echo json_encode(["success" => false, "message" => "User not found"]);
    exit();
}

$userData = $result->fetch_assoc();

// Return user data
echo json_encode([
    "success" => true, 
    "user" => [
        "id" => $userData['id'],
        "fname" => $userData['fname'],
        "email" => $userData['email'],
        "role" => $userData['role'],
        "status" => $userData['status']
    ]
]);

$conn->close();
?>
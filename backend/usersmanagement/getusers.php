<?php
session_start();

include('../config.php');


if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit(0);
}

// Get current user's ID from session
$currentUserId = isset($_SESSION['user']) ? $_SESSION['user']['id'] : null;

// Query to get all users except the current one
$query = "SELECT id, fname, email, status FROM users WHERE id != ?";

if ($currentUserId) {
    
    $stmt = $conn->prepare($query);
    $stmt->bind_param("i", $currentUserId);
    $stmt->execute();
    $result = $stmt->get_result();
} else {
    $result = $conn->query($query);
}

$users = [];

while ($row = $result->fetch_assoc()) {
    $users[] = $row;
}

echo json_encode($users);

$conn->close();
?>

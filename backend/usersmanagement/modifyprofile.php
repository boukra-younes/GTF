<?php
session_start();

include('../config.php');

$input = json_decode(file_get_contents("php://input"), true);

if (!isset($_SESSION['user'])) {
    echo json_encode(["success" => false, "message" => "Unauthorized"]);
    exit();
}

$userId = $_SESSION['user']['id'];
$fname = $input['fname'] ?? null;
$email = $input['email'] ?? null;
$currentPassword = $input['currentPassword'] ?? null;
$newPassword = $input['newPassword'] ?? null;

if (!$fname || !$email) {
    echo json_encode(["success" => false, "message" => "Missing required fields"]);
    exit();
}

// Start with basic update query
$query = "UPDATE users SET fname = ?, email = ?";
$params = [$fname, $email];
$types = "ss";

// If user is trying to change password
if ($currentPassword && $newPassword) {
    // First verify current password    
    $checkStmt = $conn->prepare("SELECT password FROM users WHERE id = ?");
    $checkStmt->bind_param("i", $userId);
    $checkStmt->execute();
    $result = $checkStmt->get_result();
    
    if ($result->num_rows === 0) {
        echo json_encode(["success" => false, "message" => "User not found"]);
        exit();
    }
    
    $user = $result->fetch_assoc();
    
    if (!password_verify($currentPassword, $user['password'])) {
        echo json_encode(["success" => false, "message" => "Current password is incorrect"]);
        exit();
    }
    
    // Password verified, add password to update query
    $hashedPassword = password_hash($newPassword, PASSWORD_DEFAULT);
    $query .= ", password = ?";
    $params[] = $hashedPassword;
    $types .= "s";
}

// Complete the query
$query .= " WHERE id = ?";
$params[] = $userId;
$types .= "i";

// Execute the update
$stmt = $conn->prepare($query);
$stmt->bind_param($types, ...$params);

if ($stmt->execute()) {
    // Update session data
    $_SESSION['user']['fname'] = $fname;
    $_SESSION['user']['email'] = $email;
    
    echo json_encode([
        "success" => true, 
        "message" => "Profile updated successfully",
        "user" => [
            "id" => $userId,
            "fname" => $fname,
            "email" => $email,
            "role" => $_SESSION['user']['role']
        ]
    ]);
} else {
    echo json_encode(["success" => false, "message" => "Update failed: " . $conn->error]);
}

$conn->close();
?>
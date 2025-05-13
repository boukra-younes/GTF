<?php
session_start();

include('../config.php');
include('../log_activity.php');

$input = json_decode(file_get_contents("php://input"), true);

if (!isset($_SESSION['user']) || $_SESSION['user']['role'] !== 'admin') {
    echo json_encode(["success" => false, "message" => "Unauthorized","rolee" => $_SESSION['user']['role']]);
    exit();
}

$id = $input['id'] ?? null;
$fname = $input['fname'] ?? null;
$email = $input['email'] ?? null;
if (!$id || !$fname || !$email) {
    echo json_encode(["success" => false, "message" => "Missing fields" , "id" => $id, "fname" => $fname, "email" => $email]);
    exit();
}

$stmt = $conn->prepare("UPDATE users SET fname = ?, email = ? WHERE id = ?");
$stmt->bind_param("ssi", $fname, $email, $id);

if ($stmt->execute()) {
    // Log the user modification activity
    logUserActivity($_SESSION['user']['id'], 'modify_user', 'Admin modified user ID: ' . $id . ', Name: ' . $fname . ', Email: ' . $email);
    
    echo json_encode(["success" => true, "message" => "User updated successfully"]);
} else {
    echo json_encode(["success" => false, "message" => "Update failed"]);
}

$conn->close();
?>

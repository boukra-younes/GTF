<?php
session_start();

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

include('../config.php');

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
    echo json_encode(["success" => true, "message" => "User updated successfully"]);
} else {
    echo json_encode(["success" => false, "message" => "Update failed"]);
}

$conn->close();
?>

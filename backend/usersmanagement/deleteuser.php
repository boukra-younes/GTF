<?php
session_start();



include('../config.php');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit(0);
}
$input = json_decode(file_get_contents("php://input"), true);

if (!isset($_SESSION['user']) || $_SESSION['user']['role'] !== 'admin') {
    echo json_encode(["success" => false, "message" => "Unauthorized","rolee" => $_SESSION['user']['role']]);
    exit();
}

$id = $input['id'] ?? null;
if (!$id ) {
    echo json_encode(["success" => false, "message" => "Missing fields" , "id" => $id]);
    exit();
}

$stmt = $conn->prepare("DELETE FROM users WHERE id = ?");
$stmt->bind_param("i", $id); 

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "User Deleted successfully"]);
} else {
    echo json_encode(["success" => false, "message" => "Delete failed"]);
}

$conn->close();
?>

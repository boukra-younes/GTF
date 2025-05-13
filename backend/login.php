<?php
session_start(); // ✅ Start session to store user info

include('config.php');
include('log_activity.php');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit(0);
}


$input = file_get_contents("php://input");
$data = json_decode($input);

if (!$data || !isset($data->email) || !isset($data->password)) {
    echo json_encode(["success" => false, "message" => "Invalid input"]);
    exit();
}

$email = $data->email;
$password = $data->password;

$stmt = $conn->prepare("SELECT * FROM users WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    echo json_encode(["success" => false, "message" => "User not found"]);
} else {
    $user = $result->fetch_assoc();

    if (password_verify($password, $user['password'])) {
        // Check if account is pending
        if ($user['status'] === 'pending') {
            echo json_encode(["success" => false, "message" => "Your account is pending admin approval. Please wait for approval before logging in."]);
            exit();
        }

        // ✅ Store user in session
        $_SESSION['user'] = [
            "id" => $user['id'],
            "email" => $user['email'],
            "fname" => $user['fname'],
            "role" => $user['role']
        ];
        
        // Log the login activity
        logUserActivity($user['id'], 'login', 'User logged in');

        echo json_encode([
            "success" => true,
            "message" => "Login successful",
            "fname" => $user['fname'],
            "role" => $user['role']
        ]);
    } else {
        echo json_encode(["success" => false, "message" => "Incorrect password"]);
    }
}

$conn->close();
?>

<?php
session_start();

include('config.php');

// Check if user is logged in and has admin privileges
if (!isset($_SESSION['user']) || $_SESSION['user']['role'] !== 'admin') {
    echo json_encode(['error' => 'Unauthorized access']);
    exit();
}

// Get query parameters
$limit = isset($_GET['limit']) ? intval($_GET['limit']) : 50;
$offset = isset($_GET['offset']) ? intval($_GET['offset']) : 0;
$userId = isset($_GET['user_id']) ? intval($_GET['user_id']) : null;

// Base query
$query = "
    SELECT a.id, a.user_id, a.action_type, a.description, a.ip_address, a.timestamp, u.fname, u.email 
    FROM user_activity a
    JOIN users u ON a.user_id = u.id
";

// Add user filter if specified
if ($userId) {
    $query .= " WHERE a.user_id = ?";
}

// Add ordering and limits
$query .= " ORDER BY a.timestamp DESC LIMIT ? OFFSET ?";

// Prepare statement
$stmt = $conn->prepare($query);

// Bind parameters
if ($userId) {
    $stmt->bind_param("iii", $userId, $limit, $offset);
} else {
    $stmt->bind_param("ii", $limit, $offset);
}

$stmt->execute();
$result = $stmt->get_result();

$activities = [];
while ($row = $result->fetch_assoc()) {
    $activities[] = [
        'id' => $row['id'],
        'user_id' => $row['user_id'],
        'user_name' => $row['fname'],
        'user_email' => $row['email'],
        'action_type' => $row['action_type'],
        'description' => $row['description'],
        'ip_address' => $row['ip_address'],
        'timestamp' => $row['timestamp']
    ];
}

// Get total count for pagination
$countQuery = "SELECT COUNT(*) as total FROM user_activity";
if ($userId) {
    $countQuery .= " WHERE user_id = ?";
    $countStmt = $conn->prepare($countQuery);
    $countStmt->bind_param("i", $userId);
} else {
    $countStmt = $conn->prepare($countQuery);
}

$countStmt->execute();
$countResult = $countStmt->get_result();
$totalCount = $countResult->fetch_assoc()['total'];

echo json_encode([
    'activities' => $activities,
    'total' => $totalCount,
    'limit' => $limit,
    'offset' => $offset
]);

$conn->close();
?>
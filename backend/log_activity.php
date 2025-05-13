<?php
function logUserActivity($userId, $actionType, $description = '') {
    global $conn;
    
    // Get IP address

    
    $stmt = $conn->prepare("INSERT INTO user_activity (user_id, action_type, description) VALUES (?, ?, ?)");
    $stmt->bind_param("iss", $userId, $actionType, $description);
    
    return $stmt->execute();
}
?>
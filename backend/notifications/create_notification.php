<?php
include('./config.php');

function createNotification($userId, $message) {
    global $conn;
    
    $stmt = $conn->prepare("INSERT INTO notifications (user_id, message) VALUES (?, ?)");
    $stmt->bind_param("is", $userId, $message);
    
    return $stmt->execute();
}

function getAdminIds() {
    global $conn;
    
    $stmt = $conn->prepare("SELECT id FROM users WHERE role = 'admin'");
    $stmt->execute();
    $result = $stmt->get_result();
    
    $adminIds = [];
    while ($row = $result->fetch_assoc()) {
        $adminIds[] = $row['id'];
    }
    
    return $adminIds;
}

function notifyAllAdmins($message) {
    $adminIds = getAdminIds();
    $success = true;
    
    foreach ($adminIds as $adminId) {
        if (!createNotification($adminId, $message)) {
            $success = false;
        }
    }
    
    return $success;
}
?> 
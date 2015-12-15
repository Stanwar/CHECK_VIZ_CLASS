<?php  
     echo "Connection with database is being attempted. \n";
   // $username = "karthick2";
   // $password = "checkkarthick";
   // $host = "10.176.25.15";
   // $database="UIHP";
    $username = "sabarish"; 
    $password = "checksabarish";   
    $host = "10.176.25.15";
    $database="UIHP";

    $server = mysql_connect($host, $username, $password);
    echo $server;
    $connection = mysql_select_db($database, $server);
// $connection = mysql_connect('testdbinstance.c254p1lk3lsl.us-east-1.rds.amazonaws.com','testuser','testuser1');
    echo "ATTEMPTING CONNECTION";
    if (!connection) {  
        echo "Connection could not be established \n";
        //die();
    }
    else
    {
        echo "CONNECTION IS LIVE!!";
//            echo "Connection has been successfully established \n";
    }
    echo "about to close this B up";
   mysql_close($connection);
?>
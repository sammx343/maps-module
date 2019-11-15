<?php
  // error_reporting(E_ALL);
  // ini_set('display_errors', 1);
  // ini_set('max_execution_time', 100);
  //
  // require('include/parametros_conexion.php');
  // $conexion = mysqli_connect($db_host,$db_user,$db_password,$db_schema);
  // $conexion -> set_charset("utf8");
  // /*$insert = mysqli_prepare($conexion,"INSERT INTO places (place_id,category_id,name,description,latitude,longitud) VALUES (?,?,?,?,?,?) ");
  //
  // $fp1 =  fopen("lugares_db.txt","r");
  // $firstLine = 1;
  // while(!feof($fp1)){
  //   $line = fgets($fp1);
  //   if($firstLine == 0){
  //     //echo $line;
  //     $line_explode = explode("@", trim($line));
  //     if(count($line_explode) > 4){
  //       echo "1";
  //       mysqli_stmt_bind_param($insert, 'ssssss',$line_explode[0],$line_explode[1],$line_explode[2],$line_explode[3],$line_explode[4],$line_explode[5]);
  //       mysqli_stmt_execute($insert);
  //     }
  //   }else{
  //     $firstLine = 0;
  //   }
  // }*/
  // $insert = mysqli_prepare($conexion,"INSERT INTO places (place_id,category_id,name,description,latitude,longitud,entry_lat,entry_long) VALUES (?,?,?,?,?,?,?,?) ");
  // $insertCat = mysqli_prepare($conexion,"INSERT INTO category (category_id,name,icon_url) VALUES (?,?,?) ");
  // $update = mysqli_prepare($conexion,"UPDATE places set latitude = ?,longitud = ?, entry_lat = ?, entry_long = ? WHERE place_id = ?");
  // $select = mysqli_prepare($conexion,"SELECT place_id FROM places WHERE place_id = ?");
  //
  // $fp1 =  fopen("categories.txt","r");
  // $firstLine = 1;
  // while(!feof($fp1)){
  //   $line = fgets($fp1);
  //   $line_explode = explode("@", trim($line));
  //   if(count($line_explode) > 2){
  //     // mysqli_stmt_bind_param($select,'s',$line_explode[0]);
  //     // mysqli_stmt_execute($select);
  //     // mysqli_stmt_bind_result($select, $id);
  //     // if(mysqli_stmt_fetch($select)) {
  //     //
  //     // }else{
  //     //   $empty = '';
  //     //   $cat = 0;
  //     //   mysqli_stmt_bind_param($insert, 'ssssssss',$line_explode[0],$cat,$line_explode[1],$line_explode[6],$line_explode[2],$line_explode[3],$line_explode[4],$line_explode[5]);
  //     //   mysqli_stmt_execute($insert);
  //     //   echo "insert";
  //     // }
  //     //mysqli_stmt_bind_param($update, 'sssss',$line_explode[2],$line_explode[3],$line_explode[4],$line_explode[5],$line_explode[0]);
  //     //mysqli_stmt_execute($update);
  //     //echo "update";
  //     mysqli_stmt_bind_param($insertCat, 'sss',$line_explode[0],$line_explode[1],$line_explode[2]);
  //     mysqli_stmt_execute($insertCat);
  //     echo "insert";
  //   }
  // }
  // /*$id = 11;
  // $select = mysqli_prepare($conexion,"SELECT * FROM places WHERE place_id = ?");
  // mysqli_stmt_bind_param($select,'s',$id);
  // mysqli_stmt_execute($select);
  // mysqli_stmt_bind_result($select, $id, $cat, $name, $desc, $lat, $long, $entr_lat, $entr_long);
  // while (mysqli_stmt_fetch($select)) {
  //   printf ("%s (%s)\n", $id, $name);
  // }*/
  // mysqli_close($conexion);
?>

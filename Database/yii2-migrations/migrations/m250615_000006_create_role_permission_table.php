<?php

use yii\db\Migration;

/**
 * Class m250615_000006_create_role_permission_table
 */
class m250615_000006_create_role_permission_table extends Migration
{
    /**
     * {@inheritdoc}
     */
    public function safeUp()
    {
        $this->createTable('{{%role_permission}}', [
            'id' => $this->primaryKey(),
            'id_role' => $this->smallInteger(6)->defaultValue(null),
            'modul_fitur' => $this->string(100)->defaultValue(null),
            'akses' => $this->tinyInteger(1)->defaultValue(0),
            'create' => $this->tinyInteger(1)->defaultValue(0),
            'read' => "ENUM('All','Own','No') DEFAULT 'No'",
            'update' => "ENUM('All','Own','No') DEFAULT 'No'",
            'delete' => "ENUM('All','Own','No') DEFAULT 'No'",
        ], 'ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci');

        $this->addForeignKey('{{%fk_permission_role}}', '{{%role_permission}}', 'id_role', '{{%user_role}}', 'id', 'CASCADE', 'CASCADE');
    }

    /**
     * {@inheritdoc}
     */
    public function safeDown()
    {
        $this->dropForeignKey('{{%fk_permission_role}}', '{{%role_permission}}');
        $this->dropTable('{{%role_permission}}');
    }
}

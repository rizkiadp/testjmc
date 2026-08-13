<?php

use yii\db\Migration;

/**
 * Class m250615_000005_create_user_role_table
 */
class m250615_000005_create_user_role_table extends Migration
{
    /**
     * {@inheritdoc}
     */
    public function safeUp()
    {
        $this->createTable('{{%user_role}}', [
            'id' => $this->primaryKey()->notNull(),
            'nama_role' => $this->string(100)->defaultValue(null),
            'deskripsi' => $this->text()->defaultValue(null),
            'created_at' => $this->timestamp()->defaultValue(null),
        ], 'ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci');
    }

    /**
     * {@inheritdoc}
     */
    public function safeDown()
    {
        $this->dropTable('{{%user_role}}');
    }
}

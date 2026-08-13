<?php

use yii\db\Migration;

/**
 * Class m250615_000007_create_user_table
 */
class m250615_000007_create_user_table extends Migration
{
    /**
     * {@inheritdoc}
     */
    public function safeUp()
    {
        $this->createTable('{{%user}}', [
            'id' => $this->primaryKey(),
            'id_role' => $this->smallInteger(6)->defaultValue(null),
            'id_pegawai' => $this->integer(11)->defaultValue(null),
            'username' => $this->string(100)->defaultValue(null)->unique(),
            'password_hash' => $this->string(255)->defaultValue(null),
            'nama' => $this->string(255)->defaultValue(null),
            'email' => $this->string(255)->defaultValue(null),
            'last_session' => $this->string(255)->defaultValue(null),
            'last_login' => $this->timestamp()->defaultValue(null),
            'updated_at' => $this->timestamp()->defaultValue(null)->append('ON UPDATE CURRENT_TIMESTAMP'),
            'created_at' => $this->timestamp()->defaultValue(null),
            'disabled' => $this->tinyInteger(4)->defaultValue(0),
        ], 'ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci ROW_FORMAT=DYNAMIC');

        $this->addForeignKey('{{%user_ibfk_1}}', '{{%user}}', 'id_role', '{{%user_role}}', 'id', 'CASCADE', 'CASCADE');
        $this->addForeignKey('{{%fk_user_pegawai}}', '{{%user}}', 'id_pegawai', '{{%pegawai}}', 'id', 'SET NULL', 'CASCADE');
    }

    /**
     * {@inheritdoc}
     */
    public function safeDown()
    {
        $this->dropForeignKey('{{%fk_user_pegawai}}', '{{%user}}');
        $this->dropForeignKey('{{%user_ibfk_1}}', '{{%user}}');
        $this->dropTable('{{%user}}');
    }
}

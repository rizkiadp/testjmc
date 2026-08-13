<?php

use yii\db\Migration;

/**
 * Class m250615_000001_create_master_data_table
 */
class m250615_000001_create_master_data_table extends Migration
{
    /**
     * {@inheritdoc}
     */
    public function safeUp()
    {
        $this->createTable('{{%master_data}}', [
            'id' => $this->primaryKey(),
            'nama' => $this->string(100)->defaultValue(null),
            'tipe' => $this->string(50)->defaultValue(null), // Contoh: 'jabatan', 'departemen'
        ], 'ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci');
    }

    /**
     * {@inheritdoc}
     */
    public function safeDown()
    {
        $this->dropTable('{{%master_data}}');
    }
}

<?php

use yii\db\Migration;

/**
 * Class m250615_000002_create_master_wilayah_table
 */
class m250615_000002_create_master_wilayah_table extends Migration
{
    /**
     * {@inheritdoc}
     */
    public function safeUp()
    {
        $this->createTable('{{%master_wilayah}}', [
            'id' => $this->primaryKey(),
            'kecamatan' => $this->string(100)->defaultValue(null),
            'kabupaten' => $this->string(100)->defaultValue(null),
            'provinsi' => $this->string(100)->defaultValue(null),
        ], 'ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci');

        $this->createIndex('{{%idx_kecamatan}}', '{{%master_wilayah}}', 'kecamatan');
    }

    /**
     * {@inheritdoc}
     */
    public function safeDown()
    {
        $this->dropIndex('{{%idx_kecamatan}}', '{{%master_wilayah}}');
        $this->dropTable('{{%master_wilayah}}');
    }
}

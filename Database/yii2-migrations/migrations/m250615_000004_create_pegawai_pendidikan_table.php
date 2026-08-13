<?php

use yii\db\Migration;

/**
 * Class m250615_000004_create_pegawai_pendidikan_table
 */
class m250615_000004_create_pegawai_pendidikan_table extends Migration
{
    /**
     * {@inheritdoc}
     */
    public function safeUp()
    {
        $this->createTable('{{%pegawai_pendidikan}}', [
            'id' => $this->primaryKey(),
            'id_pegawai' => $this->integer(11)->defaultValue(null),
            'tingkat_pendidikan' => $this->string(50)->defaultValue(null), // Contoh: SD, SMP, SMA, S1
            'nama_sekolah' => $this->string(255)->defaultValue(null),
            'tahun_lulus' => $this->integer(4)->defaultValue(null),
        ], 'ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci');

        $this->addForeignKey('{{%fk_pendidikan_pegawai}}', '{{%pegawai_pendidikan}}', 'id_pegawai', '{{%pegawai}}', 'id', 'CASCADE', 'CASCADE');
    }

    /**
     * {@inheritdoc}
     */
    public function safeDown()
    {
        $this->dropForeignKey('{{%fk_pendidikan_pegawai}}', '{{%pegawai_pendidikan}}');
        $this->dropTable('{{%pegawai_pendidikan}}');
    }
}

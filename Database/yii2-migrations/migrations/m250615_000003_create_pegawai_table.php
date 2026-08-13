<?php

use yii\db\Migration;

/**
 * Class m250615_000003_create_pegawai_table
 */
class m250615_000003_create_pegawai_table extends Migration
{
    /**
     * {@inheritdoc}
     */
    public function safeUp()
    {
        $this->createTable('{{%pegawai}}', [
            'id' => $this->primaryKey(),
            'foto_pegawai' => $this->string(255)->defaultValue(null),
            'nip' => $this->string(30)->defaultValue(null)->unique(),
            'nama_pegawai' => $this->string(255)->defaultValue(null),
            'email' => $this->string(255)->defaultValue(null)->unique(),
            'nomor_hp' => $this->string(20)->defaultValue(null),
            'tempat_lahir' => $this->string(100)->defaultValue(null),
            'id_kecamatan' => $this->integer(11)->defaultValue(null),
            'alamat_lengkap' => $this->text()->defaultValue(null),
            'jarak_rumah_kantor' => $this->tinyInteger(2)->defaultValue(null),
            'tanggal_lahir' => $this->date()->defaultValue(null),
            'status_kawin' => "ENUM('kawin','tidak kawin') DEFAULT NULL",
            'jumlah_anak' => $this->tinyInteger(2)->defaultValue(0),
            'tanggal_masuk' => $this->date()->defaultValue(null),
            'id_jabatan' => $this->integer(11)->defaultValue(null),
            'id_departemen' => $this->integer(11)->defaultValue(null),
            'usia' => $this->integer(11)->defaultValue(null),
            'status' => "ENUM('Aktif','Nonaktif') DEFAULT 'Aktif'",
            'created_at' => $this->timestamp()->defaultValue(null),
            'updated_at' => $this->timestamp()->defaultValue(null)->append('ON UPDATE CURRENT_TIMESTAMP'),
        ], 'ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci');

        $this->addForeignKey('{{%fk_pegawai_jabatan}}', '{{%pegawai}}', 'id_jabatan', '{{%master_data}}', 'id', 'CASCADE', 'CASCADE');
        $this->addForeignKey('{{%fk_pegawai_departemen}}', '{{%pegawai}}', 'id_departemen', '{{%master_data}}', 'id', 'CASCADE', 'CASCADE');
        $this->addForeignKey('{{%fk_pegawai_kecamatan}}', '{{%pegawai}}', 'id_kecamatan', '{{%master_wilayah}}', 'id', 'CASCADE', 'CASCADE');
    }

    /**
     * {@inheritdoc}
     */
    public function safeDown()
    {
        $this->dropForeignKey('{{%fk_pegawai_kecamatan}}', '{{%pegawai}}');
        $this->dropForeignKey('{{%fk_pegawai_departemen}}', '{{%pegawai}}');
        $this->dropForeignKey('{{%fk_pegawai_jabatan}}', '{{%pegawai}}');
        $this->dropTable('{{%pegawai}}');
    }
}

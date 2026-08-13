<?php

use yii\db\Migration;

class m250615_000012_create_tunjangan_transport_detail_table extends Migration
{
    public function safeUp()
    {
        $this->createTable('{{%tunjangan_transport_detail}}', [
            'id' => $this->primaryKey(),
            'id_tunjangan_transport' => $this->integer()->notNull(),
            'id_pegawai' => $this->integer()->notNull(),
            'jarak_km' => $this->integer()->defaultValue(0),
            'jumlah_hari' => $this->integer()->defaultValue(0),
            'nominal' => $this->decimal(12, 2)->defaultValue(0.00),
        ]);

        $this->addForeignKey(
            'fk_tunjangan_detail_header',
            '{{%tunjangan_transport_detail}}',
            'id_tunjangan_transport',
            '{{%tunjangan_transport}}',
            'id',
            'CASCADE',
            'CASCADE'
        );

        $this->addForeignKey(
            'fk_tunjangan_detail_pegawai',
            '{{%tunjangan_transport_detail}}',
            'id_pegawai',
            '{{%pegawai}}',
            'id',
            'CASCADE',
            'CASCADE'
        );
    }

    public function safeDown()
    {
        $this->dropForeignKey('fk_tunjangan_detail_pegawai', '{{%tunjangan_transport_detail}}');
        $this->dropForeignKey('fk_tunjangan_detail_header', '{{%tunjangan_transport_detail}}');
        $this->dropTable('{{%tunjangan_transport_detail}}');
    }
}

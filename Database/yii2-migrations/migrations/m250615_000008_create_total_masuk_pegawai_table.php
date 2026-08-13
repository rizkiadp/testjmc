<?php

use yii\db\Migration;

class m250615_000008_create_total_masuk_pegawai_table extends Migration
{
    public function safeUp()
    {
        $this->createTable('{{%total_masuk_pegawai}}', [
            'id' => $this->primaryKey(),
            'id_pegawai' => $this->integer()->notNull(),
            'bulan' => $this->smallInteger()->notNull(),
            'tahun' => $this->smallInteger()->notNull(),
            'total_masuk' => $this->smallInteger()->notNull()->defaultValue(0),
            'created_at' => $this->timestamp()->defaultExpression('CURRENT_TIMESTAMP'),
            'updated_at' => $this->timestamp()->defaultExpression('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
        ]);

        $this->createIndex(
            'uk_pegawai_bulan_tahun',
            '{{%total_masuk_pegawai}}',
            ['id_pegawai', 'bulan', 'tahun'],
            true
        );

        $this->addForeignKey(
            'fk_total_masuk_pegawai',
            '{{%total_masuk_pegawai}}',
            'id_pegawai',
            '{{%pegawai}}',
            'id',
            'CASCADE',
            'CASCADE'
        );
    }

    public function safeDown()
    {
        $this->dropForeignKey('fk_total_masuk_pegawai', '{{%total_masuk_pegawai}}');
        $this->dropTable('{{%total_masuk_pegawai}}');
    }
}

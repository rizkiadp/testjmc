<?php

use yii\db\Migration;

class m250615_000011_create_tunjangan_transport_table extends Migration
{
    public function safeUp()
    {
        $this->createTable('{{%tunjangan_transport}}', [
            'id' => $this->primaryKey(),
            'bulan' => $this->integer()->notNull(),
            'tahun' => $this->integer()->notNull(),
            'total_penerima' => $this->integer()->defaultValue(0),
            'total_nominal' => $this->decimal(15, 2)->defaultValue(0.00),
            'created_at' => $this->timestamp()->defaultExpression('CURRENT_TIMESTAMP'),
            'updated_at' => $this->timestamp()->defaultExpression('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
        ]);
    }

    public function safeDown()
    {
        $this->dropTable('{{%tunjangan_transport}}');
    }
}

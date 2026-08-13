<?php

use yii\db\Migration;

class m250615_000010_create_setting_tunjangan_transport_table extends Migration
{
    public function safeUp()
    {
        $this->createTable('{{%setting_tunjangan_transport}}', [
            'id' => $this->primaryKey(),
            'tarif_per_km' => $this->decimal(10, 2)->notNull(),
            'berlaku_mulai' => $this->date()->notNull(),
            'min_km' => $this->integer()->defaultValue(5),
            'max_km' => $this->integer()->defaultValue(25),
            'min_hari_masuk' => $this->integer()->defaultValue(19),
            'created_at' => $this->timestamp()->defaultExpression('CURRENT_TIMESTAMP'),
        ]);
    }

    public function safeDown()
    {
        $this->dropTable('{{%setting_tunjangan_transport}}');
    }
}

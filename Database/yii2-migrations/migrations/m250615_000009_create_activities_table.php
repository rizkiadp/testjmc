<?php

use yii\db\Migration;

/**
 * Class m250615_000008_create_activities_table
 */
class m250615_000008_create_activities_table extends Migration
{
    /**
     * {@inheritdoc}
     */
    public function safeUp()
    {
        $this->createTable('{{%activities}}', [
            'id' => $this->bigPrimaryKey(),
            'title' => $this->string(255)->defaultValue(null),
            'content' => $this->text()->defaultValue(null),
            'ua' => $this->string(256)->defaultValue(null), // User Agent
            'ip' => $this->string(64)->defaultValue(null),
            'url' => $this->text()->defaultValue(null),
            'browser' => $this->string(64)->defaultValue(null),
            'platform' => $this->string(64)->defaultValue(null),
            'created_at' => $this->dateTime()->defaultValue(null),
            'updated_at' => $this->dateTime()->defaultValue(null),
            'created_by' => $this->integer(11)->defaultValue(null),
            'updated_by' => $this->integer(11)->defaultValue(null),
        ], 'ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci');

        $this->addForeignKey('{{%fk_activities_created}}', '{{%activities}}', 'created_by', '{{%user}}', 'id', 'SET NULL', 'CASCADE');
        $this->addForeignKey('{{%fk_activities_updated}}', '{{%activities}}', 'updated_by', '{{%user}}', 'id', 'SET NULL', 'CASCADE');
    }

    /**
     * {@inheritdoc}
     */
    public function safeDown()
    {
        $this->dropForeignKey('{{%fk_activities_updated}}', '{{%activities}}');
        $this->dropForeignKey('{{%fk_activities_created}}', '{{%activities}}');
        $this->dropTable('{{%activities}}');
    }
}

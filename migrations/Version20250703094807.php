<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250703094807 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql(<<<'SQL'
            ALTER TABLE payment ADD reservation_id INT NOT NULL
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE payment ADD CONSTRAINT FK_6D28840DB83297E7 FOREIGN KEY (reservation_id) REFERENCES reservation (id) NOT DEFERRABLE INITIALLY IMMEDIATE
        SQL);
        $this->addSql(<<<'SQL'
            CREATE UNIQUE INDEX UNIQ_6D28840DB83297E7 ON payment (reservation_id)
        SQL);
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql(<<<'SQL'
            CREATE SCHEMA public
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE payment DROP CONSTRAINT FK_6D28840DB83297E7
        SQL);
        $this->addSql(<<<'SQL'
            DROP INDEX UNIQ_6D28840DB83297E7
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE payment DROP reservation_id
        SQL);
    }
}

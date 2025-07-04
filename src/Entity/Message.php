<?php

namespace App\Entity;

use App\Repository\MessageRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: MessageRepository::class)]
class Message
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['message:read'])]
    private ?int $id = null;

    #[ORM\Column(type: 'text')]
    #[Groups(['message:read'])]
    private ?string $content = null;

    #[ORM\Column(type: 'datetime')]
    #[Groups(['message:read'])]
    private ?\DateTimeInterface $createdAt = null;

    #[ORM\ManyToOne(targetEntity: User::class)]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['message:read'])]
    private ?User $sender = null;

    #[ORM\ManyToOne(targetEntity: User::class)]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['message:read'])]
    private ?User $recipient = null;

    
    public function getId(): ?int { return $this->id; }

    public function getContent(): ?string { return $this->content; }
    public function setContent(string $content): self {
        $this->content = $content;
        return $this;
    }

    public function getCreatedAt(): ?\DateTimeInterface { return $this->createdAt; }
    public function setCreatedAt(\DateTimeInterface $createdAt): self {
        $this->createdAt = $createdAt;
        return $this;
    }

    public function getSender(): ?User { return $this->sender; }
    public function setSender(?User $sender): self {
        $this->sender = $sender;
        return $this;
    }

    public function getRecipient(): ?User { return $this->recipient; }
    public function setRecipient(?User $recipient): self {
        $this->recipient = $recipient;
        return $this;
    }
}

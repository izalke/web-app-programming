<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Repository\PaymentRepository;
use Doctrine\ORM\Mapping as ORM;
use App\Entity\Reservation;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: PaymentRepository::class)]
class Payment
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['payment:read'])]
    private ?int $id = null;

    #[ORM\Column]
    #[Groups(['payment:read'])]
    private float $amount;

    #[ORM\Column(length: 20)]
    #[Groups(['payment:read'])]
    private string $status = 'pending'; 

    #[ORM\Column(type: 'datetime_immutable')]
    #[Groups(['payment:read'])]
    private \DateTimeImmutable $createdAt;

    #[ORM\ManyToOne(targetEntity: User::class)]
    #[Groups(['payment:read'])]
    private ?User $user = null;

    #[ORM\OneToOne(targetEntity: Reservation::class, inversedBy: "payment")]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['payment:read'])]
    private ?Reservation $reservation = null;

    public function __construct()
    {
        $this->createdAt = new \DateTimeImmutable();
    }

    public function getId(): ?int { return $this->id; }

    public function getAmount(): float { return $this->amount; }
    public function setAmount(float $amount): self { $this->amount = $amount; return $this; }

    public function getStatus(): string { return $this->status; }
    public function setStatus(string $status): self { $this->status = $status; return $this; }

    public function getCreatedAt(): \DateTimeImmutable { return $this->createdAt; }

    public function getUser(): ?User { return $this->user; }
    public function setUser(?User $user): self { $this->user = $user; return $this; }

    public function getReservation(): ?Reservation { return $this->reservation; }
    public function setReservation(?Reservation $reservation): self
    {
        $this->reservation = $reservation;
        if ($reservation && $reservation->getPayment() !== $this) {
            $reservation->setPayment($this);
        }
        return $this;
    }
}

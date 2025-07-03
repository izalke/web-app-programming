<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Repository\ReservationRepository;
use Doctrine\ORM\Mapping as ORM;
use App\Validator\NoOverlappingReservation;
use Symfony\Component\Validator\Constraints as Assert;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\Patch;
use ApiPlatform\Metadata\Delete;
use Symfony\Component\Serializer\Annotation\Groups;
use App\Entity\Vehicle;
use App\Entity\Payment;
use App\Entity\User;

#[ORM\Entity(repositoryClass: ReservationRepository::class)]
#[ApiResource(
    normalizationContext: ['groups' => ['reservation:read']],
    denormalizationContext: ['groups' => ['reservation:write']],
    operations: [
        new Get(),
        new GetCollection(),
        new Post(),
        new Patch(security: "is_granted('ROLE_USER')"),
        new Delete(security: "is_granted('ROLE_USER')")
    ]
)]
#[NoOverlappingReservation]
class Reservation
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['reservation:read'])]
    private ?int $id = null;

    #[ORM\ManyToOne(targetEntity: User::class)]
    #[Groups(['reservation:read'])]
    private ?User $user = null;

    #[ORM\ManyToOne(targetEntity: Vehicle::class)]
    #[Groups(['reservation:read', 'reservation:write'])]
    private ?Vehicle $vehicle = null;

    #[ORM\OneToOne(mappedBy: "reservation", targetEntity: Payment::class, cascade: ["persist", "remove"])]
    #[Groups(['reservation:read'])]
    private ?Payment $payment = null;

    #[ORM\Column(type: 'datetime')]
    #[Assert\NotBlank]
    #[Groups(['reservation:read', 'reservation:write'])]
    private \DateTimeInterface $startTime;

    #[ORM\Column(type: 'datetime')]
    #[Assert\NotBlank]
    #[Groups(['reservation:read', 'reservation:write'])]
    private \DateTimeInterface $endTime;

    #[ORM\Column(length: 20)]
    #[Groups(['reservation:read'])]
    private string $status = 'pending';

    public function getId(): ?int { return $this->id; }

    public function getUser(): ?User { return $this->user; }
    public function setUser(?User $user): self { $this->user = $user; return $this; }

    public function getVehicle(): ?Vehicle { return $this->vehicle; }
    public function setVehicle(?Vehicle $vehicle): self { $this->vehicle = $vehicle; return $this; }

    public function getPayment(): ?Payment { return $this->payment; }
    public function setPayment(?Payment $payment): self
    {
        $this->payment = $payment;
        if ($payment && $payment->getReservation() !== $this) {
            $payment->setReservation($this);
        }
        return $this;
    }

    public function getStartTime(): \DateTimeInterface { return $this->startTime; }
    public function setStartTime(\DateTimeInterface $startTime): self { $this->startTime = $startTime; return $this; }

    public function getEndTime(): \DateTimeInterface { return $this->endTime; }
    public function setEndTime(\DateTimeInterface $endTime): self { $this->endTime = $endTime; return $this; }

    public function getStatus(): string { return $this->status; }
    public function setStatus(string $status): self { $this->status = $status; return $this; }
}

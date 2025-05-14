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
use ApiPlatform\Metadata\Put;
use ApiPlatform\Metadata\Operation;
use App\Controller\CancelReservationController;

#[ORM\Entity(repositoryClass: ReservationRepository::class)]
#[NoOverlappingReservation]
#[ApiResource(
    operations: [
        new Get(),
        new GetCollection(),
        new Post(),
        new Put(security: "object.getUser() == user or is_granted('ROLE_ADMIN')"),
        new Patch(security: "object.getUser() == user or is_granted('ROLE_ADMIN')"),
        new Delete(security: "object.getUser() == user or is_granted('ROLE_ADMIN')"),
        new Patch(
            uriTemplate: '/reservations/{id}/cancel',
            method: 'PATCH',
            controller: CancelReservationController::class,
            read: true,
            write: false,
            deserialize: false,
            security: "object.getUser() == user or is_granted('ROLE_ADMIN')",
            name: 'cancel_reservation'
        )
    ]
)]
class Reservation
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\ManyToOne(targetEntity: User::class)]
    private ?User $user = null;

    #[ORM\ManyToOne(targetEntity: Vehicle::class)]
    private ?Vehicle $vehicle = null;

    #[ORM\ManyToOne(targetEntity: Payment::class, cascade: ['persist'])]
    #[ORM\JoinColumn(nullable: true)]
    private ?Payment $payment = null;

    #[ORM\Column(type: 'datetime')]
    private \DateTimeInterface $startTime;

    #[ORM\Column(type: 'datetime')]
    private \DateTimeInterface $endTime;

    #[ORM\Column(length: 20)]
    private string $status = 'pending';

    public function getId(): ?int { return $this->id; }

    public function getUser(): ?User { return $this->user; }
    public function setUser(?User $user): self { $this->user = $user; return $this; }

    public function getVehicle(): ?Vehicle { return $this->vehicle; }
    public function setVehicle(?Vehicle $vehicle): self { $this->vehicle = $vehicle; return $this; }

    public function getPayment(): ?Payment { return $this->payment; }
    public function setPayment(?Payment $payment): self { $this->payment = $payment; return $this; }

    public function getStartTime(): \DateTimeInterface { return $this->startTime; }
    public function setStartTime(\DateTimeInterface $startTime): self { $this->startTime = $startTime; return $this; }

    public function getEndTime(): \DateTimeInterface { return $this->endTime; }
    public function setEndTime(\DateTimeInterface $endTime): self { $this->endTime = $endTime; return $this; }

    public function getStatus(): string { return $this->status; }
    public function setStatus(string $status): self { $this->status = $status; return $this; }
}

<?php

namespace App\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProcessorInterface;
use App\Entity\Reservation;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\SecurityBundle\Security;

class ReservationProcessor implements ProcessorInterface
{
    public function __construct(
        private ProcessorInterface $decorated,
        private Security $security,
        private EntityManagerInterface $entityManager,
    ) {}

    public function process(mixed $data, Operation $operation, array $uriVariables = [], array $context = []): mixed
    {
        if ($data instanceof Reservation && $this->security->getUser()) {
            $data->setUser($this->security->getUser());

            $vehicle = $data->getVehicle();
            $status = $data->getStatus();

            if ($vehicle && $status) {
                if (in_array($status, ['pending', 'active'])) {
                    $vehicle->setAvailable(false);
                }

                if (in_array($status, ['cancelled', 'completed'])) {
                    $vehicle->setAvailable(true);
                }

                $this->entityManager->persist($vehicle);
            }
        }

        return $this->decorated->process($data, $operation, $uriVariables, $context);
    }
}

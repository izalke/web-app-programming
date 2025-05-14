<?php

namespace App\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProcessorInterface;
use App\Entity\Reservation;
use Symfony\Bundle\SecurityBundle\Security;

class ReservationProcessor implements ProcessorInterface
{
    public function __construct(
        private ProcessorInterface $decorated,
        private Security $security
    ) {}

    public function process(mixed $data, Operation $operation, array $uriVariables = [], array $context = []): mixed
    {
        if ($data instanceof Reservation && $this->security->getUser()) {
            $data->setUser($this->security->getUser());
        }

        return $this->decorated->process($data, $operation, $uriVariables, $context);
    }
}

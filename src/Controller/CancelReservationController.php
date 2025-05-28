<?php

namespace App\Controller;

use App\Repository\ReservationRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;

class CancelReservationController
{
    public function __construct(
        private EntityManagerInterface $em,
        private ReservationRepository $reservationRepository,
        private Security $security
    ) {}

    #[Route('/api/reservations/{id}/cancel', name: 'cancel_reservation', methods: ['POST'])]
    public function __invoke(int $id): JsonResponse
    {
        $reservation = $this->reservationRepository->find($id);

        if (!$reservation) {
            return new JsonResponse(['error' => 'Nie znaleziono rezerwacji'], 404);
        }

        $user = $this->security->getUser();
        if ($reservation->getUser() !== $user) {
            return new JsonResponse(['error' => 'Nie masz dostępu do tej rezerwacji'], 403);
        }

        $reservation->setStatus('cancelled');
        $this->em->flush();

        return new JsonResponse(['message' => 'Rezerwacja anulowana'], 200);
    }
}

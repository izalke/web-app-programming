<?php

namespace App\Controller;

use App\Entity\Reservation;
use App\Entity\Vehicle;
use App\Repository\ReservationRepository;
use App\Repository\VehicleRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use Symfony\Component\Validator\Validator\ValidatorInterface;
use Symfony\Component\Serializer\SerializerInterface;

#[Route('/api/reservations')]
class ReservationController extends AbstractController
{
    #[Route('', name: 'reservation_index', methods: ['GET'])]
    public function index(ReservationRepository $reservationRepository): JsonResponse
    {
        $this->denyAccessUnlessGranted('ROLE_USER');
        $user = $this->getUser();
        $reservations = $reservationRepository->findBy(['user' => $user]);

        return $this->json($reservations, 200, [], ['groups' => 'reservation:read']);
    }

    #[Route('', name: 'reservation_create', methods: ['POST'])]
    #[IsGranted('ROLE_USER')]
    public function create(
        Request $request,
        EntityManagerInterface $em,
        VehicleRepository $vehicleRepo,
        ValidatorInterface $validator,
        SerializerInterface $serializer
    ): JsonResponse {
        $user = $this->getUser();
        $data = json_decode($request->getContent(), true);

        
        $vehicle = $vehicleRepo->find($data['vehicle'] ?? null);
        if (!$vehicle) {
            return new JsonResponse(['error' => 'Vehicle not found'], 404);
        }

       
        if (!$vehicle->isAvailable()) {
            return new JsonResponse(['error' => 'Vehicle not available'], 400);
        }

        $reservation = new Reservation();
        $reservation->setUser($user);
        $reservation->setVehicle($vehicle);
        $reservation->setStartTime(new \DateTime($data['startTime']));
        $reservation->setEndTime(new \DateTime($data['endTime']));
        $reservation->setStatus('pending');

        
        $errors = $validator->validate($reservation);
        if (count($errors) > 0) {
            return new JsonResponse($serializer->normalize($errors, null, ['groups' => 'reservation:read']), 400);
        }

        $em->persist($reservation);
        $em->flush();

        return $this->json($reservation, 201, [], ['groups' => 'reservation:read']);
    }

    #[Route('/{id}', name: 'reservation_show', methods: ['GET'])]
    public function show(Reservation $reservation): JsonResponse
    {
        $this->denyAccessUnlessGranted('ROLE_USER');
        if ($reservation->getUser() !== $this->getUser()) {
            return new JsonResponse(['error' => 'Forbidden'], 403);
        }

        return $this->json($reservation, 200, [], ['groups' => 'reservation:read']);
    }

    #[Route('/{id}', name: 'reservation_update', methods: ['PUT'])]
    #[IsGranted('ROLE_USER')]
    public function update(
        Request $request,
        Reservation $reservation,
        EntityManagerInterface $em,
        ValidatorInterface $validator,
        SerializerInterface $serializer
    ): JsonResponse {
        if ($reservation->getUser() !== $this->getUser()) {
            return new JsonResponse(['error' => 'Forbidden'], 403);
        }

        $data = json_decode($request->getContent(), true);

        $reservation->setStartTime(new \DateTime($data['startTime']));
        $reservation->setEndTime(new \DateTime($data['endTime']));

        $errors = $validator->validate($reservation);
        if (count($errors) > 0) {
            return new JsonResponse($serializer->normalize($errors, null, ['groups' => 'reservation:read']), 400);
        }

        $em->flush();

        return $this->json($reservation, 200, [], ['groups' => 'reservation:read']);
    }

    #[Route('/{id}', name: 'reservation_delete', methods: ['DELETE'])]
    #[IsGranted('ROLE_USER')]
    public function delete(Reservation $reservation, EntityManagerInterface $em): JsonResponse
    {
        if ($reservation->getUser() !== $this->getUser()) {
            return new JsonResponse(['error' => 'Forbidden'], 403);
        }

        $em->remove($reservation);
        $em->flush();

        return new JsonResponse(null, 204);
    }
}

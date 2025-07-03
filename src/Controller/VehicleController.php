<?php

namespace App\Controller;

use App\Entity\Vehicle;
use App\Repository\VehicleRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[Route('/api/vehicles')]
class VehicleController extends AbstractController
{
    #[Route('', name: 'vehicle_index', methods: ['GET'])]
    public function index(VehicleRepository $repo): JsonResponse
    {
        return $this->json($repo->findAll(), 200, [], ['groups' => 'vehicle:read']);
    }

    #[Route('', name: 'vehicle_create', methods: ['POST'])]
    #[IsGranted('ROLE_ADMIN')]
    public function create(Request $request, EntityManagerInterface $em): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        $vehicle = new Vehicle();
        $vehicle->setBrand($data['brand'] ?? '');
        $vehicle->setModel($data['model'] ?? '');
        $vehicle->setLicensePlate($data['licensePlate'] ?? '');
        $vehicle->setAvailable($data['available'] ?? true);
        $vehicle->setLatitude($data['latitude'] ?? null);
        $vehicle->setLongitude($data['longitude'] ?? null);
        $vehicle->setPricePerHour($data['pricePerHour'] ?? null);

        $em->persist($vehicle);
        $em->flush();

        return $this->json($vehicle, 201, [], ['groups' => 'vehicle:read']);
    }

    #[Route('/{id}', name: 'vehicle_show', methods: ['GET'])]
    public function show(Vehicle $vehicle): JsonResponse
    {
        return $this->json($vehicle, 200, [], ['groups' => 'vehicle:read']);
    }

    #[Route('/{id}', name: 'vehicle_update', methods: ['PUT'])]
    #[IsGranted('ROLE_ADMIN')]
    public function update(Request $request, Vehicle $vehicle, EntityManagerInterface $em): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        $vehicle->setBrand($data['brand'] ?? $vehicle->getBrand());
        $vehicle->setModel($data['model'] ?? $vehicle->getModel());
        $vehicle->setLicensePlate($data['licensePlate'] ?? $vehicle->getLicensePlate());
        $vehicle->setAvailable($data['available'] ?? $vehicle->isAvailable());
        $vehicle->setLatitude($data['latitude'] ?? $vehicle->getLatitude());
        $vehicle->setLongitude($data['longitude'] ?? $vehicle->getLongitude());
        $vehicle->setPricePerHour($data['pricePerHour'] ?? $vehicle->getPricePerHour());

        $em->flush();

        return $this->json($vehicle, 200, [], ['groups' => 'vehicle:read']);
    }

    #[Route('/{id}', name: 'vehicle_delete', methods: ['DELETE'])]
    #[IsGranted('ROLE_ADMIN')]
    public function delete(Vehicle $vehicle, EntityManagerInterface $em): JsonResponse
    {
        $em->remove($vehicle);
        $em->flush();

        return new JsonResponse(null, 204);
    }
}

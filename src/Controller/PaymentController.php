<?php

namespace App\Controller;

use App\Entity\Payment;
use App\Entity\Reservation;
use App\Repository\PaymentRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use ApiPlatform\Api\IriConverterInterface;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\IsGranted;

#[Route('/api/payments')]
class PaymentController extends AbstractController
{
    #[Route('', name: 'payment_index', methods: ['GET'])]
    public function index(PaymentRepository $paymentRepository): JsonResponse
    {
        return $this->json(
            $paymentRepository->findAll(),
            200,
            [],
            ['groups' => 'payment:read']
        );
    }

   #[Route('', name: 'payment_create', methods: ['POST'])]
#[IsGranted('ROLE_USER')]
public function create(
    Request $request,
    EntityManagerInterface $em,
    IriConverterInterface $iriConverter
): JsonResponse {
    $user = $this->getUser();
    $data = json_decode($request->getContent(), true);

    $amount = $data['amount'] ?? null;
    $reservationIri = $data['reservation'] ?? null;

    if (!$amount || !$reservationIri) {
        return new JsonResponse(['error' => 'Brak danych'], 400);
    }

    try {
        $reservation = $iriConverter->getItemFromIri($reservationIri);
    } catch (\Exception $e) {
        return new JsonResponse(['error' => 'Niepoprawny IRI rezerwacji'], 400);
    }

    if (!$reservation instanceof Reservation || !$reservation->getId()) {
        return new JsonResponse(['error' => 'Rezerwacja nie znaleziona'], 404);
    }

    
    if ($reservation->getPayment()) {
        return new JsonResponse(['error' => 'Płatność już istnieje dla tej rezerwacji!'], 400);
    }

    $payment = new Payment();
    $payment->setUser($user);
    $payment->setAmount($amount);
    $payment->setStatus('pending');
    $payment->setReservation($reservation);

    $em->persist($payment);
    $em->flush();

    return $this->json($payment, 201, [], ['groups' => 'payment:read']);
}

    #[Route('/{id}', name: 'payment_show', methods: ['GET'])]
    public function show(Payment $payment): JsonResponse
    {
        return $this->json($payment, 200, [], ['groups' => 'payment:read']);
    }

    #[Route('/{id}', name: 'payment_update', methods: ['PUT'])]
    public function update(Request $request, Payment $payment, EntityManagerInterface $em): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        if (isset($data['amount'])) {
            $payment->setAmount($data['amount']);
        }

        if (isset($data['status'])) {
            $payment->setStatus($data['status']);
        }

        $em->flush();

        return $this->json($payment, 200, [], ['groups' => 'payment:read']);
    }

    #[Route('/{id}', name: 'payment_delete', methods: ['DELETE'])]
    public function delete(Payment $payment, EntityManagerInterface $em): JsonResponse
    {
        $em->remove($payment);
        $em->flush();

        return new JsonResponse(null, 204);
    }

    #[Route('/{id}/pay', name: 'payment_pay', methods: ['POST'])]
    public function pay(int $id, PaymentRepository $paymentRepository, EntityManagerInterface $em): JsonResponse
    {
        $payment = $paymentRepository->find($id);
        if (!$payment) {
            return $this->json(['error' => 'Płatność nie znaleziona'], 404);
        }

        $payment->setStatus('paid');

        $reservation = $payment->getReservation();
        if ($reservation) {
            $reservation->setStatus('paid');
        }

        $em->flush();

        return $this->json(['message' => 'Płatność opłacona']);
    }
}
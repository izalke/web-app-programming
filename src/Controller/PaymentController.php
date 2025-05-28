<?php
namespace App\Controller;

use App\Repository\PaymentRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class PaymentController extends AbstractController
{
    #[Route('/api/payments/{id}/pay', name: 'payment_pay', methods: ['POST'])]
    public function pay(int $id, PaymentRepository $paymentRepository, EntityManagerInterface $em): JsonResponse
    {
        $payment = $paymentRepository->find($id);
        if (!$payment) {
            return $this->json(['error' => 'Płatność nie znaleziona'], 404);
        }

        // Załóżmy, że Payment ma setStatus i getReservation
        $payment->setStatus('paid');

        $reservation = $payment->getReservation();
        if ($reservation) {
            $reservation->setStatus('paid'); // lub 'active' – według Twojej logiki
        }

        $em->flush();

        return $this->json(['message' => 'Płatność opłacona']);
    }
}

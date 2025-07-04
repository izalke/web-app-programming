<?php

namespace App\Controller;

use App\Entity\Message;
use App\Entity\User;
use App\Repository\MessageRepository;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\IsGranted;
use Doctrine\DBAL\Connection;
#[Route('/api/messages')]
class MessageController extends AbstractController
{
    #[Route('', methods: ['GET'])]
    #[IsGranted('ROLE_USER')]
    public function index(MessageRepository $repo): JsonResponse
    {
        $user = $this->getUser();

        $messages = $repo->createQueryBuilder('m')
            ->where('m.sender = :user OR m.recipient = :user')
            ->setParameter('user', $user)
            ->orderBy('m.createdAt', 'ASC')
            ->getQuery()
            ->getResult();

        return $this->json($messages, 200, [], ['groups' => 'message:read']);
    }

    #[Route('', methods: ['POST'])]
    #[IsGranted('ROLE_USER')]
    public function send(
        Request $request,
        EntityManagerInterface $em,
        UserRepository $userRepo
    ): JsonResponse {
        $data = json_decode($request->getContent(), true);
        $user = $this->getUser();

        if (empty($data['content']) || empty($data['recipient'])) {
            return new JsonResponse(['error' => 'Brak treści lub odbiorcy'], 400);
        }

        // Parsowanie IRI np. "/api/users/1"
        if (preg_match('#/api/users/(\d+)#', $data['recipient'], $matches)) {
            $recipientId = $matches[1];
        } else {
            return new JsonResponse(['error' => 'Nieprawidłowy identyfikator odbiorcy'], 400);
        }

        $recipient = $userRepo->find($recipientId);
        if (!$recipient) {
            return new JsonResponse(['error' => 'Nie znaleziono odbiorcy'], 404);
        }

        $message = new Message();
        $message->setContent($data['content']);
        $message->setSender($user);
        $message->setRecipient($recipient);
        $message->setCreatedAt(new \DateTime());

        $em->persist($message);
        $em->flush();

        return $this->json($message, 201, [], ['groups' => 'message:read']);
    }


#[Route('/conversations', name: 'api_conversations', methods: ['GET'])]
#[IsGranted('ROLE_ADMIN')]
public function conversations(Connection $conn): JsonResponse
{
    $userId = $this->getUser()->getId();

    $sql = "
    SELECT u.id, u.email
    FROM \"user\" u
    WHERE u.id != :me
";

    $result = $conn->executeQuery($sql, ['me' => $userId])->fetchAllAssociative();

    return $this->json($result);
}


}

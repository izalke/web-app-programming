<!-- namespace App\EventListener;

use App\Entity\User;
use Doctrine\Persistence\Event\LifecycleEventArgs;

class UserRoleListener
{
    public function prePersist(User $user, LifecycleEventArgs $args): void
    {
        if (empty($user->getRoles())) {
            $user->setRoles(['ROLE_USER']);
        }
    }
} -->
